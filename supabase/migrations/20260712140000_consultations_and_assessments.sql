-- Consultations (comptes-rendus de séance)
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  consultation_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  mood INTEGER CHECK (mood BETWEEN 1 AND 10),
  objectives TEXT,
  techniques TEXT,
  report TEXT NOT NULL,
  advice TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS consultations_client_id_idx ON public.consultations(client_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage consultations" ON public.consultations;
CREATE POLICY "Admins manage consultations" ON public.consultations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_consultations_updated_at ON public.consultations;
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Energy assessments (bilans énergétiques, 8 axes 0-10)
CREATE TABLE IF NOT EXISTS public.energy_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  assessment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  axis_energie INTEGER NOT NULL DEFAULT 5 CHECK (axis_energie BETWEEN 0 AND 10),
  axis_stress INTEGER NOT NULL DEFAULT 5 CHECK (axis_stress BETWEEN 0 AND 10),
  axis_emotions INTEGER NOT NULL DEFAULT 5 CHECK (axis_emotions BETWEEN 0 AND 10),
  axis_motivation INTEGER NOT NULL DEFAULT 5 CHECK (axis_motivation BETWEEN 0 AND 10),
  axis_confiance INTEGER NOT NULL DEFAULT 5 CHECK (axis_confiance BETWEEN 0 AND 10),
  axis_fatigue INTEGER NOT NULL DEFAULT 5 CHECK (axis_fatigue BETWEEN 0 AND 10),
  axis_douleurs INTEGER NOT NULL DEFAULT 5 CHECK (axis_douleurs BETWEEN 0 AND 10),
  axis_concentration INTEGER NOT NULL DEFAULT 5 CHECK (axis_concentration BETWEEN 0 AND 10),
  observations TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS energy_assessments_client_id_idx ON public.energy_assessments(client_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.energy_assessments TO authenticated;
GRANT ALL ON public.energy_assessments TO service_role;
ALTER TABLE public.energy_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage energy assessments" ON public.energy_assessments;
CREATE POLICY "Admins manage energy assessments" ON public.energy_assessments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_energy_assessments_updated_at ON public.energy_assessments;
CREATE TRIGGER update_energy_assessments_updated_at BEFORE UPDATE ON public.energy_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
