import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// Public server function used by the admin "Send test email" button and as
// a safety net from the checkout flow. Dedup is enforced inside the server
// helper via `registration_email_sent` on the lead row.
export const sendRegistrationEmail = createServerFn({ method: 'POST' })
  .inputValidator((data) =>
    z
      .object({
        leadId: z.string().uuid().optional(),
        to: z.string().email().optional(),
        name: z.string().max(120).optional(),
        force: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { sendRegistrationConfirmationEmail } = await import('@/lib/registration-email.server')

    let to = data.to
    let name = data.name

    if (data.leadId) {
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
      const { data: lead, error } = await (supabaseAdmin as any)
        .from('clinic_growth_leads')
        .select('email, full_name, registration_email_sent')
        .eq('id', data.leadId)
        .maybeSingle()
      if (error) throw error
      if (!lead) throw new Error('Lead not found')
      to = to || lead.email
      name = name || lead.full_name
    }

    if (!to) throw new Error('Recipient email required')

    return await sendRegistrationConfirmationEmail({
      to,
      name,
      leadId: data.leadId,
      force: data.force,
    })
  })
