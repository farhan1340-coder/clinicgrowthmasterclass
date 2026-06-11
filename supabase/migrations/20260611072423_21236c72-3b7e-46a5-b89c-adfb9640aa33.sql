
-- Revoke read/update/delete privileges from public roles; keep only INSERT for lead submission
REVOKE SELECT, UPDATE, DELETE ON public.clinic_growth_leads FROM anon, authenticated, PUBLIC;
GRANT INSERT ON public.clinic_growth_leads TO anon, authenticated;
GRANT ALL ON public.clinic_growth_leads TO service_role;

-- Explicit restrictive RLS policies to deny SELECT/UPDATE/DELETE for anon and authenticated
DROP POLICY IF EXISTS "Deny select to public" ON public.clinic_growth_leads;
CREATE POLICY "Deny select to public"
  ON public.clinic_growth_leads
  AS RESTRICTIVE
  FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Deny update to public" ON public.clinic_growth_leads;
CREATE POLICY "Deny update to public"
  ON public.clinic_growth_leads
  AS RESTRICTIVE
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Deny delete to public" ON public.clinic_growth_leads;
CREATE POLICY "Deny delete to public"
  ON public.clinic_growth_leads
  AS RESTRICTIVE
  FOR DELETE
  TO anon, authenticated
  USING (false);
