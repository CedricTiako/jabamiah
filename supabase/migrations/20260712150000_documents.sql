-- Documents table (admin-only CRUD, no public/anon access)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  doc_type TEXT,
  description TEXT,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_client_id_idx ON public.documents(client_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage documents" ON public.documents;
CREATE POLICY "Admins manage documents" ON public.documents
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage: private bucket `client-documents` (bucket itself created via API, not SQL)
DROP POLICY IF EXISTS "Admins read client documents" ON storage.objects;
CREATE POLICY "Admins read client documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins upload client documents" ON storage.objects;
CREATE POLICY "Admins upload client documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update client documents" ON storage.objects;
CREATE POLICY "Admins update client documents" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete client documents" ON storage.objects;
CREATE POLICY "Admins delete client documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'));
