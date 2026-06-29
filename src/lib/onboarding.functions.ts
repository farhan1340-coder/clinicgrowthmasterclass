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
  };
}

export const submitOnboarding = createServerFn({ method: "POST" })
  .inputValidator(validate)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any)
      .from("clinic_growth_leads")
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        onboarding_primary_goals: data.primary_goals,
        onboarding_tried_before: data.tried_before,
        onboarding_biggest_frustration: data.biggest_frustration,
        onboarding_decision_reasons: data.decision_reasons,
        onboarding_skepticism: data.skepticism,
        onboarding_implementation_help: data.implementation_help,
        onboarding_done_for_you_interest: data.done_for_you_interest,
        onboarding_other_help: data.other_help ?? null,
      })
      .eq("id", data.leadId);
    if (error) throw error;
    return { ok: true };
  });
