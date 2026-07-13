-- Protocols table (admin-only CRUD, no public/anon access)
CREATE TABLE IF NOT EXISTS public.protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('energetique', 'meditation', 'respiration', 'harmonisation', 'purification')),
  duration_minutes INTEGER,
  steps TEXT,
  warnings TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.protocols TO authenticated;
GRANT ALL ON public.protocols TO service_role;
ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage protocols" ON public.protocols;
CREATE POLICY "Admins manage protocols" ON public.protocols
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_protocols_updated_at ON public.protocols;
CREATE TRIGGER update_protocols_updated_at BEFORE UPDATE ON public.protocols
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
