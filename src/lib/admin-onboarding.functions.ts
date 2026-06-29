import { createServerFn } from "@tanstack/react-start";

export type OnboardingRow = {
  id: string;
  lead_id: string;
  created_at: string;
  // snapshot
  email: string;
  whatsapp: string;
  full_name: string | null;
  specialty: string | null;
  city: string | null;
  // answers
  primary_goals: string[];
  tried_before: string[];
  biggest_frustration: string | null;
  decision_reasons: string[];
  skepticism: string | null;
  implementation_help: string[];
  done_for_you_interest: string | null;
  other_help: string | null;
  // joined buyer record
  lead: {
    id: string;
    full_name: string;
    email: string;
    whatsapp: string;
    specialty: string | null;
    lead_status: string;
    total_amount: number;
    payment_method: string;
    payment_screenshot_url: string | null;
    created_at: string;
  } | null;
};

function asArr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string");
}

export const listOnboardingResponses = createServerFn({ method: "GET" }).handler(
  async (): Promise<OnboardingRow[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("clinic_growth_onboarding_responses")
      .select(
        `id, lead_id, created_at, email, whatsapp, full_name, specialty, city,
         primary_goals, tried_before, biggest_frustration, decision_reasons,
         skepticism, implementation_help, done_for_you_interest, other_help,
         lead:clinic_growth_leads!clinic_growth_onboarding_responses_lead_id_fkey(
           id, full_name, email, whatsapp, specialty, lead_status, total_amount,
           payment_method, payment_screenshot_url, created_at
         )`,
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      id: r.id,
      lead_id: r.lead_id,
      created_at: r.created_at,
      email: r.email,
      whatsapp: r.whatsapp,
      full_name: r.full_name,
      specialty: r.specialty,
      city: r.city,
      primary_goals: asArr(r.primary_goals),
      tried_before: asArr(r.tried_before),
      biggest_frustration: r.biggest_frustration,
      decision_reasons: asArr(r.decision_reasons),
      skepticism: r.skepticism,
      implementation_help: asArr(r.implementation_help),
      done_for_you_interest: r.done_for_you_interest,
      other_help: r.other_help,
      lead: r.lead ?? null,
    }));
  },
);
