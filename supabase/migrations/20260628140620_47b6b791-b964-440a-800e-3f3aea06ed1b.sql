
CREATE TABLE public.abandoned_checkout_email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.clinic_growth_leads(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  sequence_number SMALLINT NOT NULL CHECK (sequence_number BETWEEN 1 AND 4),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','skipped','failed','cancelled')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lead_id, sequence_number)
);

GRANT ALL ON public.abandoned_checkout_email_queue TO service_role;

ALTER TABLE public.abandoned_checkout_email_queue ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_abandoned_queue_due
  ON public.abandoned_checkout_email_queue (scheduled_for)
  WHERE status = 'pending';

CREATE INDEX idx_abandoned_queue_lead
  ON public.abandoned_checkout_email_queue (lead_id);
