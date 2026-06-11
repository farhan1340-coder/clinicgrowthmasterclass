
CREATE TABLE public.clinic_growth_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  selected_order_bumps JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  lead_status TEXT NOT NULL DEFAULT 'Pending Payment',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.clinic_growth_leads TO anon, authenticated;
GRANT ALL ON public.clinic_growth_leads TO service_role;
ALTER TABLE public.clinic_growth_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.clinic_growth_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
