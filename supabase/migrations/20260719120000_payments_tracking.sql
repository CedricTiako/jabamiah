-- Full payment traceability: lifecycle status, dedicated Stripe identifiers,
-- and "stripe" as a proper source (previously mis-tagged as "paypal" to satisfy
-- the old check constraint).

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_source_check;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_source_check CHECK (source IN ('manual', 'paypal', 'stripe'));

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'succeeded'
  CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded'));

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS payments_stripe_session_id_key
  ON public.payments(stripe_session_id) WHERE stripe_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS payments_status_idx ON public.payments(status);

-- Re-tag past Stripe donations that were stored as source='paypal' due to the legacy constraint.
UPDATE public.payments SET source = 'stripe' WHERE method = 'stripe_card' AND source = 'paypal';

-- Recover the Stripe checkout session id for rows the webhook created before this migration
-- (it stored the session id in `reference`, e.g. "cs_live_..." / "cs_test_...").
UPDATE public.payments
SET stripe_session_id = reference
WHERE source = 'stripe' AND stripe_session_id IS NULL AND reference LIKE 'cs\_%' ESCAPE '\';
