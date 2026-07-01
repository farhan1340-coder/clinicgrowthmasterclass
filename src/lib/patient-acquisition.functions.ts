import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  specialty: z.string().trim().min(2).max(120),
  clinic_name: z.string().trim().max(200).optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  whatsapp: z.string().trim().min(6).max(40),
  email: z.string().trim().toLowerCase().email().max(200),
  payment_method: z.string().trim().max(60).optional().nullable(),
  payment_screenshot_url: z.string().trim().max(2000).optional().nullable(),
  optional_message: z.string().trim().max(2000).optional().nullable(),
  amount: z.number().optional(),
});

export const submitPatientAcquisitionOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("patient_acquisition_orders")
      .insert({
        full_name: data.full_name,
        specialty: data.specialty,
        clinic_name: data.clinic_name ?? null,
        city: data.city ?? null,
        whatsapp: data.whatsapp,
        email: data.email,
        payment_method: data.payment_method ?? null,
        payment_screenshot_url: data.payment_screenshot_url ?? null,
        optional_message: data.optional_message ?? null,
        amount: data.amount ?? 23500,
        order_status: "Special Offer Payment Submitted",
        source: "patient-acquisition-machine",
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: row.id };
  });
