
DROP POLICY "Anyone can submit a lead" ON public.clinic_growth_leads;
CREATE POLICY "Public can submit a lead" ON public.clinic_growth_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 255
    AND length(whatsapp) BETWEEN 3 AND 40
    AND total_amount >= 0
    AND length(payment_method) BETWEEN 1 AND 40
  );
