CREATE TABLE public.clinic_growth_onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.clinic_growth_leads(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  full_name TEXT,
  specialty TEXT,
  city TEXT,
  primary_goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  tried_before JSONB NOT NULL DEFAULT '[]'::jsonb,
  biggest_frustration TEXT,
  decision_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  skepticism TEXT,
  implementation_help JSONB NOT NULL DEFAULT '[]'::jsonb,
  done_for_you_interest TEXT,
  other_help TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lead_id)
);

GRANT ALL ON public.clinic_growth_onboarding_responses TO service_role;

ALTER TABLE public.clinic_growth_onboarding_responses ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_cgor_lead_id ON public.clinic_growth_onboarding_responses(lead_id);
CREATE INDEX idx_cgor_email ON public.clinic_growth_onboarding_responses(email);
CREATE INDEX idx_cgor_created_at ON public.clinic_growth_onboarding_responses(created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_cgor_updated_at
BEFORE UPDATE ON public.clinic_growth_onboarding_responses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();