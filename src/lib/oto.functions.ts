import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const leadIdSchema = z.object({ leadId: z.string().uuid() });

const otoPaymentSchema = z.object({
  leadId: z.string().uuid(),
  full_name: z.string().trim().min(1).max(120),
  whatsapp: z.string().trim().min(3).max(40),
  transaction_id: z.string().trim().max(120).optional().nullable(),
  screenshot_url: z.string().trim().min(1).max(1000),
});

const STRATEGY_BUMP = {
  id: "strategy",
  title: "1-on-1 Personalized Digital Marketing Strategy Session",
  price: 3999,
} as const;

type LeadRow = {
  id: string;
  lead_status: string;
  total_amount: number;
  selected_order_bumps: unknown;
};

function parseBumps(value: unknown): Array<{ id?: string; title?: string; price?: number }> {
  return Array.isArray(value) ? (value as Array<{ id?: string; title?: string; price?: number }>) : [];
}

function hasStrategyBump(value: unknown) {
  return parseBumps(value).some((item) => item?.id === STRATEGY_BUMP.id);
}

function hasDeclinedStatus(status: unknown) {
  return typeof status === "string" && status.includes("OTO Declined");
}

function normalizeStatus(base: string, decision: "accepted" | "declined") {
  const cleaned = base
    .replace(/\s*[—-]\s*OTO Accepted/g, "")
    .replace(/\s*[—-]\s*OTO Declined/g, "")
    .trim();
  return `${cleaned} - OTO ${decision === "accepted" ? "Accepted" : "Declined"}`;
}

async function getLeadRow(leadId: string): Promise<LeadRow | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (supabaseAdmin as any)
    .from("clinic_growth_leads")
    .select("id, lead_status, total_amount, selected_order_bumps")
    .eq("id", leadId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as LeadRow | null;
}

export const getOtoEligibility = createServerFn({ method: "GET" })
  .inputValidator((data) => leadIdSchema.parse(data))
  .handler(async ({ data }) => {
    const lead = await getLeadRow(data.leadId);
    if (!lead) {
      return { eligible: false, accepted: false, declined: false };
    }

    const accepted = hasStrategyBump(lead.selected_order_bumps);
    const declined = hasDeclinedStatus(lead.lead_status);

    return {
      eligible: !accepted && !declined,
      accepted,
      declined,
      leadId: lead.id,
      currentTotal: Number(lead.total_amount ?? 0),
    };
  });

export const acceptOtoOffer = createServerFn({ method: "POST" })
  .inputValidator((data) => leadIdSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const lead = await getLeadRow(data.leadId);
    if (!lead) throw new Error("Lead not found");
    if (hasDeclinedStatus(lead.lead_status)) {
      return { ok: false, reason: "declined" as const };
    }
    if (hasStrategyBump(lead.selected_order_bumps)) {
      return { ok: true, reason: "already-accepted" as const };
    }

    const selected = parseBumps(lead.selected_order_bumps);
    const updatedBumps = [...selected, STRATEGY_BUMP];
    const nextTotal = Number(lead.total_amount ?? 0) + STRATEGY_BUMP.price;

    const { error } = await (supabaseAdmin as any)
      .from("clinic_growth_leads")
      .update({
        selected_order_bumps: updatedBumps,
        total_amount: nextTotal,
        lead_status: normalizeStatus(lead.lead_status || "Pending Payment", "accepted"),
      })
      .eq("id", lead.id);

    if (error) throw error;
    return { ok: true, reason: "accepted" as const };
  });

export const declineOtoOffer = createServerFn({ method: "POST" })
  .inputValidator((data) => leadIdSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const lead = await getLeadRow(data.leadId);
    if (!lead) throw new Error("Lead not found");
    if (hasStrategyBump(lead.selected_order_bumps)) {
      return { ok: true, reason: "already-accepted" as const };
    }
    if (hasDeclinedStatus(lead.lead_status)) {
      return { ok: true, reason: "already-declined" as const };
    }

    const { error } = await (supabaseAdmin as any)
      .from("clinic_growth_leads")
      .update({
        lead_status: normalizeStatus(lead.lead_status || "Pending Payment", "declined"),
      })
      .eq("id", lead.id);

    if (error) throw error;
    return { ok: true, reason: "declined" as const };
  });
