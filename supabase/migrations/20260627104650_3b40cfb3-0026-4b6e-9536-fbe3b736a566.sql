
DROP POLICY IF EXISTS "Public read blog covers" ON storage.objects;
CREATE POLICY "Public read blog covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-covers');

DROP POLICY IF EXISTS "Admins upload blog covers" ON storage.objects;
CREATE POLICY "Admins upload blog covers" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-covers' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update blog covers" ON storage.objects;
CREATE POLICY "Admins update blog covers" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-covers' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete blog covers" ON storage.objects;
CREATE POLICY "Admins delete blog covers" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-covers' AND public.has_role(auth.uid(), 'admin'));
