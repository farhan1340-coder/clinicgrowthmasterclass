import { createServerFn } from "@tanstack/react-start";

type OnboardingInput = {
  leadId: string;
  primary_goals: string[];
  tried_before: string[];
  biggest_frustration: string;
  decision_reasons: string[];
  skepticism: string;
  implementation_help: string[];
  done_for_you_interest: string;
  other_help?: string;
  city?: string;
};

function asStrArray(v: unknown, max = 20): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x) => typeof x === "string")
    .map((x) => (x as string).trim().slice(0, 200))
    .filter(Boolean)
    .slice(0, max);
}

function validate(data: unknown): OnboardingInput {
  if (!data || typeof data !== "object") throw new Error("Invalid payload");
  const d = data as Record<string, unknown>;
  const leadId = String(d.leadId ?? "").trim();
  if (!/^[0-9a-fA-F-]{8,}$/.test(leadId)) throw new Error("Invalid leadId");
  const biggest_frustration = String(d.biggest_frustration ?? "").trim().slice(0, 2000);
  const skepticism = String(d.skepticism ?? "").trim().slice(0, 2000);
  const done_for_you_interest = String(d.done_for_you_interest ?? "").trim().slice(0, 200);
  const other_help = String(d.other_help ?? "").trim().slice(0, 2000);
  const city = String(d.city ?? "").trim().slice(0, 200);
  if (!skepticism) throw new Error("Skepticism is required");
  if (!done_for_you_interest) throw new Error("Please choose an option");
  return {
    leadId,
    primary_goals: asStrArray(d.primary_goals),
    tried_before: asStrArray(d.tried_before),
    biggest_frustration,
    decision_reasons: asStrArray(d.decision_reasons),
    skepticism,
    implementation_help: asStrArray(d.implementation_help),
    done_for_you_interest,
    other_help: other_help || undefined,
    city: city || undefined,
  };
}

export const submitOnboarding = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Look up the buyer to snapshot identity fields onto the response row.
    const { data: lead, error: leadErr } = await (supabaseAdmin as any)
      .from("clinic_growth_leads")
      .select("id, email, whatsapp, full_name, specialty")
      .eq("id", data.leadId)
      .maybeSingle();
    if (leadErr) throw leadErr;
    if (!lead) throw new Error("Order not found");

    // Upsert into the dedicated onboarding responses table (one row per buyer).
    const { error: insErr } = await (supabaseAdmin as any)
      .from("clinic_growth_onboarding_responses")
      .upsert(
        {
          lead_id: lead.id,
          email: lead.email,
          whatsapp: lead.whatsapp,
          full_name: lead.full_name,
          specialty: lead.specialty,
          city: data.city ?? null,
          primary_goals: data.primary_goals,
          tried_before: data.tried_before,
          biggest_frustration: data.biggest_frustration || null,
          decision_reasons: data.decision_reasons,
          skepticism: data.skepticism,
          implementation_help: data.implementation_help,
          done_for_you_interest: data.done_for_you_interest,
          other_help: data.other_help ?? null,
        },
        { onConflict: "lead_id" },
      );
    if (insErr) throw insErr;

    // Keep the existing completion flag on the buyer record so downstream
    // flows (thank-you, admin status) continue to work — but do NOT write
    // any answer content back to clinic_growth_leads.
    const { error: updErr } = await (supabaseAdmin as any)
      .from("clinic_growth_leads")
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", lead.id);
    if (updErr) throw updErr;

    return { ok: true };
  });
