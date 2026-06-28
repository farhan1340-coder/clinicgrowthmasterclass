import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// Admin-only server functions backing the /admin/leads1340 follow-up panel.
// These are unauthenticated server functions but the page itself is an
// unlisted admin URL (same posture as the existing leads listing).

export const listAbandonedRemindersForLead = createServerFn({ method: 'GET' })
  .inputValidator((data) => z.object({ leadId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { data: rows, error } = await (supabaseAdmin as any)
      .from('abandoned_checkout_email_queue')
      .select('id, sequence_number, scheduled_for, sent_at, status, error_message')
      .eq('lead_id', data.leadId)
      .order('sequence_number', { ascending: true })
    if (error) throw error
    return rows ?? []
  })

export const listAbandonedRemindersAll = createServerFn({ method: 'GET' }).handler(async () => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const { data, error } = await (supabaseAdmin as any)
    .from('abandoned_checkout_email_queue')
    .select('id, lead_id, sequence_number, scheduled_for, sent_at, status, error_message')
  if (error) throw error
  return data ?? []
})

export const sendAbandonedReminderNow = createServerFn({ method: 'POST' })
  .inputValidator((data) => z.object({ queueId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { sendQueuedAbandonedReminder, cancelRemainingAbandonedReminders } = await import(
      '@/lib/abandoned-checkout.server'
    )
    const { data: row, error } = await (supabaseAdmin as any)
      .from('abandoned_checkout_email_queue')
      .select('id, lead_id, email, name, sequence_number, status')
      .eq('id', data.queueId)
      .maybeSingle()
    if (error) throw error
    if (!row) throw new Error('Queue row not found')

    const res = await sendQueuedAbandonedReminder(row)
    if (res.ok) {
      await (supabaseAdmin as any)
        .from('abandoned_checkout_email_queue')
        .update({ status: 'sent', sent_at: new Date().toISOString(), error_message: null })
        .eq('id', row.id)
      return { ok: true }
    }
    if (res.reason === 'lead_already_paid' || res.reason === 'suppressed') {
      await (supabaseAdmin as any)
        .from('abandoned_checkout_email_queue')
        .update({ status: 'skipped', error_message: res.reason })
        .eq('id', row.id)
      await cancelRemainingAbandonedReminders(row.lead_id, res.reason)
    } else {
      await (supabaseAdmin as any)
        .from('abandoned_checkout_email_queue')
        .update({ status: 'failed', error_message: res.reason })
        .eq('id', row.id)
    }
    return { ok: false, reason: res.reason }
  })

export const cancelAbandonedRemindersForLead = createServerFn({ method: 'POST' })
  .inputValidator((data) => z.object({ leadId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { cancelRemainingAbandonedReminders } = await import(
      '@/lib/abandoned-checkout.server'
    )
    const count = await cancelRemainingAbandonedReminders(data.leadId, 'admin_cancelled')
    return { ok: true, cancelled: count }
  })

/**
 * Test mode — schedule a fresh 4-email flow against an arbitrary email
 * address WITHOUT requiring a real lead. We create (or reuse) a dummy
 * lead row tagged with lead_status "Test - Abandoned Sequence" so the
 * normal sender + skip checks behave like production.
 *
 * Optional `accelerate` argument compresses the schedule to 1/2/5/10 minutes
 * so the full flow can be observed within ~15 minutes.
 */
export const startAbandonedTestFlow = createServerFn({ method: 'POST' })
  .inputValidator((data) =>
    z
      .object({
        email: z.string().email(),
        name: z.string().min(1).max(120).optional(),
        accelerate: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const email = data.email.trim().toLowerCase()
    const name = data.name?.trim() || 'Test Doctor'

    // Find or create a dummy lead
    const { data: existing } = await (supabaseAdmin as any)
      .from('clinic_growth_leads')
      .select('id')
      .eq('email', email)
      .eq('lead_status', 'Test - Abandoned Sequence')
      .maybeSingle()

    let leadId: string
    if (existing?.id) {
      leadId = existing.id
      await (supabaseAdmin as any)
        .from('clinic_growth_leads')
        .update({ full_name: name, payment_screenshot_url: null })
        .eq('id', leadId)
      // Wipe any previous test queue rows so we get a clean run
      await (supabaseAdmin as any)
        .from('abandoned_checkout_email_queue')
        .delete()
        .eq('lead_id', leadId)
    } else {
      const { data: ins, error: insErr } = await (supabaseAdmin as any)
        .from('clinic_growth_leads')
        .insert({
          full_name: name,
          email,
          whatsapp: '00000000000',
          lead_status: 'Test - Abandoned Sequence',
          payment_method: 'pending',
          total_amount: 0,
          selected_order_bumps: [],
        })
        .select('id')
        .single()
      if (insErr) throw insErr
      leadId = ins.id
    }

    const delays = data.accelerate
      ? { 1: 1 * 60_000, 2: 2 * 60_000, 3: 5 * 60_000, 4: 10 * 60_000 }
      : { 1: 5 * 60_000, 2: 60 * 60_000, 3: 24 * 60 * 60_000, 4: 48 * 60 * 60_000 }
    const now = Date.now()
    const rows = ([1, 2, 3, 4] as const).map((seq) => ({
      lead_id: leadId,
      email,
      name,
      sequence_number: seq,
      scheduled_for: new Date(now + delays[seq]).toISOString(),
      status: 'pending' as const,
    }))
    const { error } = await (supabaseAdmin as any)
      .from('abandoned_checkout_email_queue')
      .insert(rows)
    if (error) throw error
    return { ok: true, leadId, accelerated: !!data.accelerate }
  })

export const processAbandonedNow = createServerFn({ method: 'POST' }).handler(async () => {
  const { processDueAbandonedReminders } = await import('@/lib/abandoned-checkout.server')
  return await processDueAbandonedReminders({ limit: 200 })
})
