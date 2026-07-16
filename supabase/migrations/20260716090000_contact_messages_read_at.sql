-- Tracks whether an admin has seen a contact message, powering the notification bell.
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

GRANT UPDATE ON public.contact_messages TO authenticated;

DROP POLICY IF EXISTS "Admins update contact messages" ON public.contact_messages;
CREATE POLICY "Admins update contact messages" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
