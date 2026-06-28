ALTER TABLE public.clinic_growth_leads
  ADD COLUMN IF NOT EXISTS registration_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS registration_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS registration_email_error TEXT;