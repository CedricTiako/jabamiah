-- Allows the client status (Nouveau/Actif/Fidèle/Inactif) to be computed
-- automatically from appointment history, while still letting an admin pin
-- it manually. When status_locked is true, automatic recalculation is skipped.
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS status_locked BOOLEAN NOT NULL DEFAULT false;
