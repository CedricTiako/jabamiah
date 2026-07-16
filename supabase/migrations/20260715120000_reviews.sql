-- Client testimonials/reviews: public submission, admin moderation before publishing.
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_email TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_status_idx ON public.reviews(status);

-- Public submission goes through the service-role client in the API route (like
-- contact_messages) — no anon INSERT grant, to keep validation server-side only.
-- Public display, however, needs direct anon SELECT of approved reviews.
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read approved reviews" ON public.reviews;
CREATE POLICY "Public can read approved reviews" ON public.reviews
  FOR SELECT TO anon USING (status = 'approved');

DROP POLICY IF EXISTS "Admins manage reviews" ON public.reviews;
CREATE POLICY "Admins manage reviews" ON public.reviews
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
