
ALTER TABLE public.clinic_growth_leads ADD COLUMN IF NOT EXISTS payment_screenshot_url text;

CREATE POLICY "Anyone can upload payment screenshots"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'payment-screenshots');
