// Server-only helpers for the abandoned-checkout follow-up sequence.
// - schedule 4 reminders when a lead opts in
// - send one reminder via pgmq (mirrors registration-email.server.ts)
// - skip when the lead has already paid or unsubscribed
import * as React from 'react'
import { render } from 'react-email'
import { TEMPLATES } from '@/lib/email-templates/registry'
import { supabaseAdmin } from '@/integrations/supabase/client.server'
import {
  MASTERCLASS_DATE_ISO,
  formatCohortDate,
  formatCohortTime,
  getCohortStartMs,
} from '@/lib/cohort'

const SITE_NAME = 'Clinic Growth Masterclass'
const SENDER_DOMAIN = 'notify.zeroappleaday.site'
const FROM_DOMAIN = 'zeroappleaday.site'
const CHECKOUT_BASE = 'https://www.zeroappleaday.site/order'

// Sequences 1-4 are relative delays from opt-in. Sequences 5-6 are
// absolute times anchored to the cohort start (see computeCohortSlot).
export const SEQUENCE_DELAYS_MS: Record<1 | 2 | 3 | 4, number> = {
  1: 1 * 60 * 1000, // ~immediately (1 minute)
  2: 8 * 60 * 60 * 1000, // 8 hours
  3: 24 * 60 * 60 * 1000, // 24 hours
  4: 60 * 60 * 60 * 1000, // 60 hours
}

/** Deadline reminders: how many minutes BEFORE cohort start to send. */
const COHORT_LEAD_MINUTES: Record<5 | 6, number> = {
  5: 4 * 60, // 4 hours before
  6: 1 * 60, // 1 hour before
}

function computeCohortSlot(seq: 5 | 6): Date {
  return new Date(getCohortStartMs() - COHORT_LEAD_MINUTES[seq] * 60_000)
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
    s.startsWith('registered')
  )
}

/**
 * Schedule the follow-up reminders for a freshly opted-in lead:
 * - Sequences 1-4: relative delays after opt-in (see SEQUENCE_DELAYS_MS)
 * - Sequences 5-6: deadline reminders anchored to the current cohort
 *   (4h and 1h before start). Only scheduled if the send time is in the
 *   future.
 * No-op if any rows already exist for this lead (idempotent).
 */
export async function scheduleAbandonedCheckoutSequence(opts: {
  leadId: string
  email: string
  name: string
  startAt?: Date
}): Promise<void> {
  const start = opts.startAt ?? new Date()
  const now = Date.now()
  const rows: Array<Record<string, any>> = ([1, 2, 3, 4] as const).map((seq) => ({
    lead_id: opts.leadId,
    email: opts.email,
    name: opts.name,
    sequence_number: seq,
    scheduled_for: new Date(start.getTime() + SEQUENCE_DELAYS_MS[seq]).toISOString(),
    status: 'pending' as const,
  }))
  for (const seq of [5, 6] as const) {
    const when = computeCohortSlot(seq)
    if (when.getTime() > now) {
      rows.push({
        lead_id: opts.leadId,
        email: opts.email,
        name: opts.name,
        sequence_number: seq,
        scheduled_for: when.toISOString(),
        status: 'pending' as const,
      })
    }
  }
  const { error } = await (supabaseAdmin as any)
    .from('abandoned_checkout_email_queue')
    .upsert(rows, { onConflict: 'lead_id,sequence_number', ignoreDuplicates: true })
  if (error) {
    console.error('[abandoned-checkout] schedule failed', { leadId: opts.leadId, error })
  }
}

/**
 * Backfill deadline reminders (seq 5 & 6) for every unpaid lead that already
 * has abandoned-checkout rows but is missing the deadline ones. Idempotent;
 * safe to call from the cron on every tick.
 */
export async function ensureCohortDeadlineReminders(): Promise<number> {
  const now = Date.now()
  const slots = ([5, 6] as const)
    .map((seq) => ({ seq, at: computeCohortSlot(seq) }))
    .filter((s) => s.at.getTime() > now)
  if (slots.length === 0) return 0

  // Find candidate leads: have at least one queue row and are not paid.
  const { data: leads, error } = await (supabaseAdmin as any)
    .from('abandoned_checkout_email_queue')
    .select('lead_id, email, name, clinic_growth_leads!inner(id, lead_status, payment_screenshot_url)')
    .in('status', ['pending', 'sent'])
  if (error) {
    console.error('[abandoned-checkout] backfill query failed', error)
    return 0
  }

  const byLead = new Map<string, { email: string; name: string }>()
  for (const row of leads ?? []) {
    const l = (row as any).clinic_growth_leads
    if (!l) continue
    if (l.payment_screenshot_url || isPaidLikeStatus(l.lead_status)) continue
    if (!byLead.has((row as any).lead_id)) {
      byLead.set((row as any).lead_id, {
        email: (row as any).email,
        name: (row as any).name ?? 'Doctor',
      })
    }
  }
  if (byLead.size === 0) return 0

  const rows: Array<Record<string, any>> = []
  for (const [leadId, info] of byLead) {
    for (const s of slots) {
      rows.push({
        lead_id: leadId,
        email: info.email,
        name: info.name,
        sequence_number: s.seq,
        scheduled_for: s.at.toISOString(),
        status: 'pending',
      })
    }
  }
  const { error: upErr, count } = await (supabaseAdmin as any)
    .from('abandoned_checkout_email_queue')
    .upsert(rows, { onConflict: 'lead_id,sequence_number', ignoreDuplicates: true, count: 'exact' })
  if (upErr) {
    console.error('[abandoned-checkout] backfill upsert failed', upErr)
    return 0
  }
  return count ?? 0
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

  // Deadline reminders (seq 5 & 6) must never be sent after the session starts.
  if (queueRow.sequence_number >= 5 && Date.now() >= getCohortStartMs()) {
    return { ok: false, reason: 'cohort_started' }
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

  const templateData: Record<string, any> = {
    name: queueRow.name || lead.full_name || 'Doctor',
    checkoutUrl: buildCheckoutUrl(lead),
  }
  if (queueRow.sequence_number >= 5) {
    templateData.cohortDate = formatCohortDate(MASTERCLASS_DATE_ISO)
    templateData.cohortTime = formatCohortTime(MASTERCLASS_DATE_ISO)
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
