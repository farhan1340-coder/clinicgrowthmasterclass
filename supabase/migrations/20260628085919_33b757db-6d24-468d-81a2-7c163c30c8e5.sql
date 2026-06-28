
ALTER TABLE public.clinic_growth_leads
  ADD COLUMN IF NOT EXISTS oto_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS oto_payment_submitted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS oto_payment_amount integer,
  ADD COLUMN IF NOT EXISTS oto_payment_screenshot_url text,
  ADD COLUMN IF NOT EXISTS oto_transaction_id text,
  ADD COLUMN IF NOT EXISTS oto_status text,
  ADD COLUMN IF NOT EXISTS oto_full_name text,
  ADD COLUMN IF NOT EXISTS oto_whatsapp text,
  ADD COLUMN IF NOT EXISTS oto_submitted_at timestamptz;
