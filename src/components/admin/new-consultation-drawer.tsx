import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { adminUpsertConsultation } from "../../lib/consultations.functions";
import { adminListClients } from "../../lib/clients.functions";

const DURATIONS = [30, 60, 90];

const EMPTY = {
  client_id: "",
  date: "",
  time: "",
  duration_minutes: 60,
  mood: 6,
  objectives: "",
  techniques: "",
  report: "",
  advice: "",
};

export type ConsultationRecord = {
  id: string;
  client_id: string;
  consultation_date: string;
  duration_minutes: number;
  mood: number | null;
  objectives: string | null;
  techniques: string | null;
  report: string;
  advice: string | null;
};

export function NewConsultationDrawer({
  consultation,
  onCreated,
  open,
  onOpenChange,
}: {
  consultation?: ConsultationRecord | null;
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
    if (consultation) {
      const d = new Date(consultation.consultation_date);
      setForm({
        client_id: consultation.client_id,
        date: d.toISOString().slice(0, 10),
        time: d.toTimeString().slice(0, 5),
        duration_minutes: consultation.duration_minutes,
        mood: consultation.mood ?? 6,
        objectives: consultation.objectives ?? "",
        techniques: consultation.techniques ?? "",
        report: consultation.report,
        advice: consultation.advice ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, consultation]);

  const upsert = useServerFn(adminUpsertConsultation);
  const saveMutation = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          id: consultation?.id ?? null,
          client_id: form.client_id,
          consultation_date: new Date(`${form.date}T${form.time}`).toISOString(),
          duration_minutes: form.duration_minutes,
          mood: form.mood,
          objectives: form.objectives || null,
          techniques: form.techniques || null,
          report: form.report,
          advice: form.advice || null,
        },
      }),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-consultations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-consultations-by-client", form.client_id] });
      setForm(EMPTY);
      setOpen(false);
      onCreated?.(id);
    },
  });

  const field = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const canSubmit = form.client_id && form.date && form.time && form.report.trim();

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Nouvelle consultation
        </button>
      )}
      <DrawerContent className="bg-cream">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-forest">
              {consultation ? "Modifier la consultation" : "Nouvelle consultation"}
            </DrawerTitle>
            <DrawerDescription>Compte-rendu de séance.</DrawerDescription>
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
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Ressenti global</span>
              <select
                value={form.mood}
                onChange={(e) => field("mood", Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} / 10</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Objectifs travaillés</span>
              <textarea
                rows={2}
                value={form.objectives}
                onChange={(e) => field("objectives", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Techniques utilisées</span>
              <input
                value={form.techniques}
                onChange={(e) => field("techniques", e.target.value)}
                placeholder="Magnétisme, harmonisation…"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Compte-rendu *</span>
              <textarea
                rows={5}
                value={form.report}
                onChange={(e) => field("report", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Recommandations</span>
              <textarea
                rows={3}
                value={form.advice}
                onChange={(e) => field("advice", e.target.value)}
                placeholder="Exercices, plantes, rituels…"
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
              {saveMutation.isPending ? "Enregistrement…" : consultation ? "Enregistrer" : "Créer la consultation"}
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
