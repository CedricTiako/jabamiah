-- Link payments to a client (optional — most donations aren't tied to a client record).
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS payments_client_id_idx ON public.payments(client_id);
