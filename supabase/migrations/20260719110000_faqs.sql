CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS faqs_sort_order_idx ON public.faqs(sort_order);

GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published faqs" ON public.faqs;
CREATE POLICY "Public can read published faqs" ON public.faqs
  FOR SELECT TO anon
  USING (published = true);

DROP POLICY IF EXISTS "Admins manage faqs" ON public.faqs;
CREATE POLICY "Admins manage faqs" ON public.faqs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_faqs_updated_at ON public.faqs;
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.faqs (question, answer, sort_order, published)
SELECT * FROM (VALUES
  ('Les consultations sont-elles vraiment gratuites ?', 'Oui, absolument. Je n''ai jamais voulu faire payer mes soins. L''aide doit rester accessible à toutes et tous, sans condition.', 0, true),
  ('Comment prendre rendez-vous ?', 'Vous pouvez réserver directement en ligne via Calendly, ou me contacter par WhatsApp, téléphone ou email — tous les liens sont en haut de cette page.', 1, true),
  ('Les séances sont-elles disponibles à distance ?', 'Oui. Je propose des consultations en présentiel à Forges-les-Eaux (Normandie) et entièrement à distance, par téléphone ou visioconférence.', 2, true),
  ('Combien de temps dure une séance ?', 'Une séance dure en général entre 45 minutes et 1 heure, selon votre demande et vos besoins.', 3, true)
) AS seed(question, answer, sort_order, published)
WHERE NOT EXISTS (SELECT 1 FROM public.faqs);
