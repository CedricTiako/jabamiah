import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { adminUpsertAppointment } from "../../lib/appointments.functions";
import { adminListClients } from "../../lib/clients.functions";

const SESSION_TYPES = [
  { value: "premiere", label: "Première consultation" },
  { value: "suivi", label: "Suivi énergétique" },
  { value: "bilan", label: "Bilan énergétique" },
  { value: "harmonisation", label: "Harmonisation" },
  { value: "guidance", label: "Guidance spirituelle" },
];

const DURATIONS = [30, 60, 90, 120];

const LOCATIONS = [
  { value: "cabinet", label: "Cabinet — Rouen" },
  { value: "distance", label: "À distance (visio)" },
  { value: "domicile", label: "Au domicile du client" },
];

const EMPTY = {
  client_id: "",
  date: "",
  time: "",
  session_type: "premiere",
  duration_minutes: 60,
  location: "cabinet",
  note: "",
};

export function NewAppointmentDrawer({ onCreated }: { onCreated?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const queryClient = useQueryClient();

  const listClients = useServerFn(adminListClients);
  const { data: clients } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: () => listClients(),
    enabled: open,
  });

  const upsert = useServerFn(adminUpsertAppointment);
  const createMutation = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          id: null,
          client_id: form.client_id,
          starts_at: new Date(`${form.date}T${form.time}`).toISOString(),
          duration_minutes: form.duration_minutes,
          session_type: form.session_type || null,
          location: form.location || null,
          note: form.note || null,
        },
      }),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      setForm(EMPTY);
      setOpen(false);
      onCreated?.(id);
    },
  });

  const field = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const canSubmit = form.client_id && form.date && form.time;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
      >
        <Plus className="h-3.5 w-3.5" /> Nouveau RDV
      </button>
      <DrawerContent className="bg-cream">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-forest">Nouveau rendez-vous</DrawerTitle>
            <DrawerDescription>Planifier une séance avec un client.</DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Client *</span>
              <select
                value={form.client_id}
                onChange={(e) => field("client_id", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="">Sélectionner un client…</option>
                {(clients ?? []).map((c) => (
                  <option key={c.id} value={c.id}>{c.full_name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Date *</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => field("date", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Heure *</span>
              <input
                type="time"
                value={form.time}
                onChange={(e) => field("time", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Type de séance</span>
              <select
                value={form.session_type}
                onChange={(e) => field("session_type", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {SESSION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Durée</span>
              <select
                value={form.duration_minutes}
                onChange={(e) => field("duration_minutes", Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Lieu</span>
              <select
                value={form.location}
                onChange={(e) => field("location", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Note</span>
              <textarea
                rows={3}
                value={form.note}
                onChange={(e) => field("note", e.target.value)}
                placeholder="Précisions, préparation, matériel…"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
          </div>

          <div className="flex items-center gap-4 border-t border-gold/15 px-4 py-4">
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !canSubmit}
              className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-50"
            >
              {createMutation.isPending ? "Création…" : "Créer le rendez-vous"}
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
