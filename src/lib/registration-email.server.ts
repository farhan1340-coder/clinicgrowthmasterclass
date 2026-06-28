// Server-only helper that renders the registration confirmation email and
// enqueues it via pgmq. Called from server functions after a payment is
// successfully saved. Uses the service role client — never import from
// client code.
import * as React from 'react'
import { render } from 'react-email'
import { TEMPLATES } from '@/lib/email-templates/registry'
import { supabaseAdmin } from '@/integrations/supabase/client.server'

const SITE_NAME = 'Clinic Growth Masterclass'
const SENDER_DOMAIN = 'notify.zeroappleaday.site'
const FROM_DOMAIN = 'zeroappleaday.site'
const TEMPLATE_NAME = 'registration-confirmation'

function redact(email: string | null | undefined) {
  if (!email) return '***'
  const [l, d] = email.split('@')
  if (!l || !d) return '***'
  return `${l[0]}***@${d}`
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export type SendOptions = {
  to: string
  name?: string
  /** When provided, marks this lead as having received the email after enqueue. */
  leadId?: string
  /** Force re-send even if the lead is already flagged as sent. */
  force?: boolean
};

export type SendResult =
  | { ok: true; messageId: string; queued: true }
  | { ok: false; reason: string };

export async function sendRegistrationConfirmationEmail(opts: SendOptions): Promise<SendResult> {
  const recipient = (opts.to || '').trim().toLowerCase()
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { ok: false, reason: 'invalid_email' }
  }

  // Dedup: skip if this lead has already been emailed (unless forced)
  if (opts.leadId && !opts.force) {
    const { data: lead } = await (supabaseAdmin as any)
      .from('clinic_growth_leads')
      .select('registration_email_sent')
      .eq('id', opts.leadId)
      .maybeSingle()
    if (lead?.registration_email_sent === true) {
      return { ok: false, reason: 'already_sent' }
    }
  }

  const template = TEMPLATES[TEMPLATE_NAME]
  if (!template) return { ok: false, reason: 'template_missing' }

  // Suppression check
  const { data: suppressed } = await supabaseAdmin
    .from('suppressed_emails')
    .select('id')
    .eq('email', recipient)
    .maybeSingle()
  if (suppressed) {
    if (opts.leadId) {
      await (supabaseAdmin as any)
        .from('clinic_growth_leads')
        .update({ registration_email_error: 'recipient_suppressed' })
        .eq('id', opts.leadId)
    }
    return { ok: false, reason: 'suppressed' }
  }

  // Ensure unsubscribe token
  let unsubscribeToken: string | null = null
  const { data: existingTok } = await supabaseAdmin
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', recipient)
    .maybeSingle()
  if (existingTok && !existingTok.used_at) {
    unsubscribeToken = existingTok.token
  } else if (!existingTok) {
    const t = generateToken()
    await supabaseAdmin
      .from('email_unsubscribe_tokens')
      .upsert({ token: t, email: recipient }, { onConflict: 'email', ignoreDuplicates: true })
    const { data: stored } = await supabaseAdmin
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', recipient)
      .maybeSingle()
    unsubscribeToken = stored?.token ?? t
  }

  const templateData = { name: opts.name || 'Doctor' }
  const element = React.createElement(template.component, templateData)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject =
    typeof template.subject === 'function' ? template.subject(templateData) : template.subject

  const messageId = crypto.randomUUID()
  const idempotencyKey = opts.leadId
    ? `registration-confirmation-${opts.leadId}`
    : `registration-confirmation-${messageId}`

  // Log pending row first
  await supabaseAdmin.from('email_send_log').insert({
    message_id: messageId,
    template_name: TEMPLATE_NAME,
    recipient_email: recipient,
    status: 'pending',
  })

  const { error: enqErr } = await supabaseAdmin.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: TEMPLATE_NAME,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqErr) {
    console.error('[registration-email] enqueue failed', {
      error: enqErr,
      recipient: redact(recipient),
    })
    await supabaseAdmin.from('email_send_log').insert({
      message_id: messageId,
      template_name: TEMPLATE_NAME,
      recipient_email: recipient,
      status: 'failed',
      error_message: enqErr.message ?? 'enqueue failed',
    })
    if (opts.leadId) {
      await (supabaseAdmin as any)
        .from('clinic_growth_leads')
        .update({ registration_email_error: enqErr.message ?? 'enqueue failed' })
        .eq('id', opts.leadId)
    }
    return { ok: false, reason: 'enqueue_failed' }
  }

  // Mark the lead as emailed (dedup guard for future runs)
  if (opts.leadId) {
    await (supabaseAdmin as any)
      .from('clinic_growth_leads')
      .update({
        registration_email_sent: true,
        registration_email_sent_at: new Date().toISOString(),
        registration_email_error: null,
      })
      .eq('id', opts.leadId)
  }

  console.log('[registration-email] enqueued', {
    recipient: redact(recipient),
    messageId,
    leadId: opts.leadId,
  })

  return { ok: true, messageId, queued: true }
}
