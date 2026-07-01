
CREATE TABLE public.patient_acquisition_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  clinic_name TEXT,
  city TEXT,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  payment_method TEXT,
  amount NUMERIC NOT NULL DEFAULT 23500,
  payment_screenshot_url TEXT,
  optional_message TEXT,
  order_status TEXT NOT NULL DEFAULT 'Special Offer Payment Submitted',
  source TEXT DEFAULT 'patient-acquisition-machine',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.patient_acquisition_orders TO anon;
GRANT INSERT ON public.patient_acquisition_orders TO authenticated;
GRANT ALL ON public.patient_acquisition_orders TO service_role;

ALTER TABLE public.patient_acquisition_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit orders"
  ON public.patient_acquisition_orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TRIGGER trg_patient_acquisition_orders_updated_at
  BEFORE UPDATE ON public.patient_acquisition_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_patient_acquisition_orders_created_at ON public.patient_acquisition_orders (created_at DESC);
CREATE INDEX idx_patient_acquisition_orders_specialty ON public.patient_acquisition_orders (specialty);
