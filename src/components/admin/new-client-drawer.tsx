import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { adminUpsertClient } from "../../lib/clients.functions";

const STATUSES = ["Nouveau", "Actif", "Fidèle", "Inactif"] as const;

const EMPTY = {
  full_name: "",
  phone: "",
  email: "",
  city: "",
  birth_date: "",
  reason: "",
  status: "Nouveau" as (typeof STATUSES)[number],
  private_notes: "",
};

export function NewClientDrawer({ onCreated }: { onCreated?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const queryClient = useQueryClient();

  const upsert = useServerFn(adminUpsertClient);
  const createMutation = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          id: null,
          full_name: form.full_name,
          phone: form.phone || null,
          email: form.email || null,
          city: form.city || null,
          birth_date: form.birth_date || null,
          reason: form.reason || null,
          status: form.status,
          private_notes: form.private_notes || null,
        },
      }),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      setForm(EMPTY);
      setOpen(false);
      onCreated?.(id);
    },
  });

  const field = (key: keyof typeof form, value: string) => setForm((s) => ({ ...s, [key]: value }));

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
      >
        <Plus className="h-3.5 w-3.5" /> Nouveau client
      </button>
      <DrawerContent className="bg-cream">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-forest">Nouveau client</DrawerTitle>
            <DrawerDescription>Créez une fiche client. Vous pourrez compléter les informations plus tard.</DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Nom complet *</span>
              <input
                value={form.full_name}
                onChange={(e) => field("full_name", e.target.value)}
                placeholder="Sophie Martin"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Téléphone</span>
              <input
                value={form.phone}
                onChange={(e) => field("phone", e.target.value)}
                placeholder="06 12 34 56 78"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => field("email", e.target.value)}
                placeholder="sophie.martin@mail.com"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Ville</span>
              <input
                value={form.city}
                onChange={(e) => field("city", e.target.value)}
                placeholder="Rouen"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Date de naissance</span>
              <input
                type="date"
                value={form.birth_date}
                onChange={(e) => field("birth_date", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Motif de consultation</span>
              <input
                value={form.reason}
                onChange={(e) => field("reason", e.target.value)}
                placeholder="Stress, anxiété…"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Statut</span>
              <select
                value={form.status}
                onChange={(e) => field("status", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Notes privées</span>
              <textarea
                rows={3}
                value={form.private_notes}
                onChange={(e) => field("private_notes", e.target.value)}
                placeholder="Notes visibles uniquement par vous…"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
          </div>

          <div className="flex items-center gap-4 border-t border-gold/15 px-4 py-4">
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !form.full_name.trim()}
              className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-50"
            >
              {createMutation.isPending ? "Création…" : "Créer le client"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-gold/30 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
            >
              Annuler
            </button>
            {createMutation.isError && <span className="text-sm text-red-700">Erreur lors de la création.</span>}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
