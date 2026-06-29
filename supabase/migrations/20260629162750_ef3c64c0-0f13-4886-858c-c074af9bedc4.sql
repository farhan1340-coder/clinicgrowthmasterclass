ALTER TABLE public.clinic_growth_leads
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS onboarding_primary_goals jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_tried_before jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_biggest_frustration text,
  ADD COLUMN IF NOT EXISTS onboarding_decision_reasons jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_skepticism text,
  ADD COLUMN IF NOT EXISTS onboarding_implementation_help jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_done_for_you_interest text,
  ADD COLUMN IF NOT EXISTS onboarding_other_help text;