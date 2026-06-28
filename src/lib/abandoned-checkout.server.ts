// Server-only helpers for the abandoned-checkout follow-up sequence.
// - schedule 4 reminders when a lead opts in
// - send one reminder via pgmq (mirrors registration-email.server.ts)
// - skip when the lead has already paid or unsubscribed
import * as React from 'react'
import { render } from 'react-email'
import { TEMPLATES } from '@/lib/email-templates/registry'
import { supabaseAdmin } from '@/integrations/supabase/client.server'

const SITE_NAME = 'clinicgrowthmasterclass'
const SENDER_DOMAIN = 'notify.zeroappleaday.site'
const FROM_DOMAIN = 'zeroappleaday.site'
const CHECKOUT_BASE = 'https://www.zeroappleaday.site/order'

export const SEQUENCE_DELAYS_MS: Record<1 | 2 | 3 | 4, number> = {
  1: 5 * 60 * 1000, // 5 minutes
  2: 60 * 60 * 1000, // 1 hour
  3: 24 * 60 * 60 * 1000, // 24 hours
  4: 48 * 60 * 60 * 1000, // 48 hours
}

function templateNameFor(seq: number) {
  return `abandoned-checkout-${seq}`
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function redact(email: string | null | undefined) {
  if (!email) return '***'
  const [l, d] = email.split('@')
  if (!l || !d) return '***'
  return `${l[0]}***@${d}`
}

function buildCheckoutUrl(lead: { full_name?: string | null; email?: string | null; whatsapp?: string | null; specialty?: string | null }) {
  const p = new URLSearchParams()
  if (lead.full_name) p.set('full_name', lead.full_name)
  if (lead.email) p.set('email', lead.email)
  if (lead.whatsapp) p.set('phone', lead.whatsapp)
  if (lead.specialty) p.set('specialty', lead.specialty)
  const qs = p.toString()
  return qs ? `${CHECKOUT_BASE}?${qs}` : CHECKOUT_BASE
}

/**
 * A lead is considered "already converted" when payment/registration has
 * started. Once in this state we stop the abandoned-checkout sequence.
 */
export function isPaidLikeStatus(status: string | null | undefined): boolean {
  if (!status) return false
  const s = status.toLowerCase()
  return (
    s.startsWith('pending payment') ||
    s.startsWith('paid') ||
    s.startsWith('confirmed') ||
    s.startsWith('registered') ||
    s.startsWith('oto taken')
  )
}

/**
 * Schedule the 4 follow-up reminders for a freshly opted-in lead.
 * No-op if any rows already exist for this lead (idempotent across refreshes).
 */
export async function scheduleAbandonedCheckoutSequence(opts: {
  leadId: string
  email: string
  name: string
  startAt?: Date
}): Promise<void> {
  const start = opts.startAt ?? new Date()
  const rows = ([1, 2, 3, 4] as const).map((seq) => ({
    lead_id: opts.leadId,
    email: opts.email,
    name: opts.name,
    sequence_number: seq,
    scheduled_for: new Date(start.getTime() + SEQUENCE_DELAYS_MS[seq]).toISOString(),
    status: 'pending' as const,
  }))
  const { error } = await (supabaseAdmin as any)
    .from('abandoned_checkout_email_queue')
    .upsert(rows, { onConflict: 'lead_id,sequence_number', ignoreDuplicates: true })
  if (error) {
    console.error('[abandoned-checkout] schedule failed', { leadId: opts.leadId, error })
  }
}

/** Cancel any remaining pending reminders for a lead. */
export async function cancelRemainingAbandonedReminders(leadId: string, reason = 'cancelled'): Promise<number> {
  const { data, error } = await (supabaseAdmin as any)
    .from('abandoned_checkout_email_queue')
    .update({ status: 'cancelled', error_message: reason })
    .eq('lead_id', leadId)
    .eq('status', 'pending')
    .select('id')
  if (error) {
    console.error('[abandoned-checkout] cancel failed', { leadId, error })
    return 0
  }
  return data?.length ?? 0
}

export type SendQueuedResult =
  | { ok: true; messageId: string }
  | { ok: false; reason: string; retryable?: boolean };

/**
 * Send a single queued reminder. Honors lead-state and suppression checks.
 * Returns the outcome; caller updates the queue row.
 */
export async function sendQueuedAbandonedReminder(queueRow: {
  id: string
  lead_id: string
  email: string
  name: string | null
  sequence_number: number
}): Promise<SendQueuedResult> {
  const recipient = (queueRow.email || '').trim().toLowerCase()
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { ok: false, reason: 'invalid_email' }
  }

  // Lead-state check — skip if already paid
  const { data: lead, error: leadErr } = await (supabaseAdmin as any)
    .from('clinic_growth_leads')
    .select('id, email, full_name, whatsapp, specialty, lead_status, payment_screenshot_url')
    .eq('id', queueRow.lead_id)
    .maybeSingle()
  if (leadErr) return { ok: false, reason: `lead_lookup_failed:${leadErr.message}`, retryable: true }
  if (!lead) return { ok: false, reason: 'lead_missing' }
  if (lead.payment_screenshot_url || isPaidLikeStatus(lead.lead_status)) {
    return { ok: false, reason: 'lead_already_paid' }
  }

  // Suppression check (bounces / complaints / unsubscribes)
  const { data: suppressed } = await supabaseAdmin
    .from('suppressed_emails')
    .select('id')
    .eq('email', recipient)
    .maybeSingle()
  if (suppressed) return { ok: false, reason: 'suppressed' }

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

  const templateName = templateNameFor(queueRow.sequence_number)
  const template = TEMPLATES[templateName]
  if (!template) return { ok: false, reason: 'template_missing' }

  const templateData = {
    name: queueRow.name || lead.full_name || 'Doctor',
    checkoutUrl: buildCheckoutUrl(lead),
  }
  const element = React.createElement(template.component, templateData)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject =
    typeof template.subject === 'function' ? template.subject(templateData) : template.subject

  const messageId = crypto.randomUUID()
  const idempotencyKey = `abandoned-checkout-${queueRow.id}`

  await supabaseAdmin.from('email_send_log').insert({
    message_id: messageId,
    template_name: templateName,
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
      label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqErr) {
    console.error('[abandoned-checkout] enqueue failed', {
      recipient: redact(recipient),
      error: enqErr,
    })
    await supabaseAdmin.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: recipient,
      status: 'failed',
      error_message: enqErr.message ?? 'enqueue failed',
    })
    return { ok: false, reason: `enqueue_failed:${enqErr.message}`, retryable: true }
  }

  console.log('[abandoned-checkout] enqueued', {
    recipient: redact(recipient),
    seq: queueRow.sequence_number,
    leadId: queueRow.lead_id,
  })
  return { ok: true, messageId }
}

/**
 * Process all due queue rows. Used by both the cron route and manual triggers.
 */
export async function processDueAbandonedReminders(opts: { limit?: number } = {}): Promise<{
  processed: number
  sent: number
  skipped: number
  failed: number
}> {
  const limit = Math.min(opts.limit ?? 100, 500)
  const { data: due, error } = await (supabaseAdmin as any)
    .from('abandoned_checkout_email_queue')
    .select('id, lead_id, email, name, sequence_number')
    .eq('status', 'pending')
    .lte('scheduled_for', new Date().toISOString())
    .order('scheduled_for', { ascending: true })
    .limit(limit)
  if (error) throw error

  let sent = 0
  let skipped = 0
  let failed = 0

  for (const row of due ?? []) {
    const res = await sendQueuedAbandonedReminder(row as any)
    if (res.ok) {
      sent++
      await (supabaseAdmin as any)
        .from('abandoned_checkout_email_queue')
        .update({ status: 'sent', sent_at: new Date().toISOString(), error_message: null })
        .eq('id', (row as any).id)
    } else if (res.reason === 'lead_already_paid' || res.reason === 'suppressed' || res.reason === 'lead_missing') {
      skipped++
      await (supabaseAdmin as any)
        .from('abandoned_checkout_email_queue')
        .update({ status: 'skipped', error_message: res.reason })
        .eq('id', (row as any).id)
      // Cascade: cancel remaining for this lead if paid/suppressed
      if (res.reason !== 'lead_missing') {
        await cancelRemainingAbandonedReminders((row as any).lead_id, res.reason)
      }
    } else if (res.retryable) {
      failed++
      await (supabaseAdmin as any)
        .from('abandoned_checkout_email_queue')
        .update({ error_message: res.reason })
        .eq('id', (row as any).id)
    } else {
      failed++
      await (supabaseAdmin as any)
        .from('abandoned_checkout_email_queue')
        .update({ status: 'failed', error_message: res.reason })
        .eq('id', (row as any).id)
    }
  }

  return { processed: due?.length ?? 0, sent, skipped, failed }
}
