import { useEffect, useState } from "react";
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

export type AppointmentRecord = {
  id: string;
  client_id: string;
  starts_at: string;
  duration_minutes: number;
  session_type: string | null;
  location: string | null;
  note: string | null;
};

export function NewAppointmentDrawer({
  appointment,
  onCreated,
  open,
  onOpenChange,
}: {
  appointment?: AppointmentRecord | null;
  onCreated?: (id: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = (v: boolean) => (isControlled ? onOpenChange?.(v) : setInternalOpen(v));

  const [form, setForm] = useState(EMPTY);
  const queryClient = useQueryClient();

  const listClients = useServerFn(adminListClients);
  const { data: clients } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: () => listClients(),
    enabled: isOpen,
  });

  useEffect(() => {
    if (!isOpen) return;
    if (appointment) {
      const starts = new Date(appointment.starts_at);
      setForm({
        client_id: appointment.client_id,
        date: starts.toISOString().slice(0, 10),
        time: starts.toTimeString().slice(0, 5),
        session_type: appointment.session_type ?? "premiere",
        duration_minutes: appointment.duration_minutes,
        location: appointment.location ?? "cabinet",
        note: appointment.note ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, appointment]);

  const upsert = useServerFn(adminUpsertAppointment);
  const saveMutation = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          id: appointment?.id ?? null,
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
    <Drawer open={isOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Nouveau RDV
        </button>
      )}
      <DrawerContent className="bg-cream">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-forest">
              {appointment ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
            </DrawerTitle>
            <DrawerDescription>Planifier ou ajuster une séance avec un client.</DrawerDescription>
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
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !canSubmit}
              className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-50"
            >
              {saveMutation.isPending ? "Enregistrement…" : appointment ? "Enregistrer" : "Créer le rendez-vous"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-gold/30 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
            >
              Annuler
            </button>
            {saveMutation.isError && <span className="text-sm text-red-700">Erreur lors de l'enregistrement.</span>}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
