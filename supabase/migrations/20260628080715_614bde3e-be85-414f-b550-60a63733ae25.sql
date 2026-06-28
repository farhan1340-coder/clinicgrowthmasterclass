ALTER TABLE public.clinic_growth_leads
ADD COLUMN IF NOT EXISTS strategy_session_order_bump_selected boolean NOT NULL DEFAULT false;

UPDATE public.clinic_growth_leads
SET strategy_session_order_bump_selected = EXISTS (
  SELECT 1
  FROM jsonb_array_elements(COALESCE(selected_order_bumps, '[]'::jsonb)) AS bump
  WHERE bump->>'id' = 'strategy'
)
WHERE strategy_session_order_bump_selected IS DISTINCT FROM EXISTS (
  SELECT 1
  FROM jsonb_array_elements(COALESCE(selected_order_bumps, '[]'::jsonb)) AS bump
  WHERE bump->>'id' = 'strategy'
);

CREATE OR REPLACE FUNCTION public.set_strategy_session_order_bump_selected()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.strategy_session_order_bump_selected := EXISTS (
    SELECT 1
    FROM jsonb_array_elements(COALESCE(NEW.selected_order_bumps, '[]'::jsonb)) AS bump
    WHERE bump->>'id' = 'strategy'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_strategy_session_order_bump_selected_on_leads ON public.clinic_growth_leads;
CREATE TRIGGER set_strategy_session_order_bump_selected_on_leads
BEFORE INSERT OR UPDATE OF selected_order_bumps ON public.clinic_growth_leads
FOR EACH ROW
EXECUTE FUNCTION public.set_strategy_session_order_bump_selected();