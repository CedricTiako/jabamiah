ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS reply_message TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
