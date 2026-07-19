import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { DateField } from "./ui";
import { adminUpsertEnergyAssessment } from "../../lib/energy-assessments.functions";
import { adminListClients } from "../../lib/clients.functions";

const AXES = [
  { key: "axis_energie", label: "Énergie" },
  { key: "axis_stress", label: "Stress" },
  { key: "axis_emotions", label: "Émotions" },
  { key: "axis_motivation", label: "Motivation" },
  { key: "axis_confiance", label: "Confiance" },
  { key: "axis_fatigue", label: "Fatigue" },
  { key: "axis_douleurs", label: "Douleurs" },
  { key: "axis_concentration", label: "Concentration" },
] as const;

const EMPTY = {
  client_id: "",
  date: "",
  axis_energie: 5,
  axis_stress: 5,
  axis_emotions: 5,
  axis_motivation: 5,
  axis_confiance: 5,
  axis_fatigue: 5,
  axis_douleurs: 5,
  axis_concentration: 5,
  observations: "",
};

export type BilanRecord = {
  id: string;
  client_id: string;
  assessment_date: string;
  axis_energie: number;
  axis_stress: number;
  axis_emotions: number;
  axis_motivation: number;
  axis_confiance: number;
  axis_fatigue: number;
  axis_douleurs: number;
  axis_concentration: number;
  observations: string | null;
};

export function NewBilanDrawer({
  bilan,
  onCreated,
  open,
  onOpenChange,
}: {
  bilan?: BilanRecord | null;
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
    if (bilan) {
      setForm({
        client_id: bilan.client_id,
        date: bilan.assessment_date.slice(0, 10),
        axis_energie: bilan.axis_energie,
        axis_stress: bilan.axis_stress,
        axis_emotions: bilan.axis_emotions,
        axis_motivation: bilan.axis_motivation,
        axis_confiance: bilan.axis_confiance,
        axis_fatigue: bilan.axis_fatigue,
        axis_douleurs: bilan.axis_douleurs,
        axis_concentration: bilan.axis_concentration,
        observations: bilan.observations ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, bilan]);

  const upsert = useServerFn(adminUpsertEnergyAssessment);
  const saveMutation = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          id: bilan?.id ?? null,
          client_id: form.client_id,
          assessment_date: new Date(form.date || Date.now()).toISOString(),
          axis_energie: form.axis_energie,
          axis_stress: form.axis_stress,
          axis_emotions: form.axis_emotions,
          axis_motivation: form.axis_motivation,
          axis_confiance: form.axis_confiance,
          axis_fatigue: form.axis_fatigue,
          axis_douleurs: form.axis_douleurs,
          axis_concentration: form.axis_concentration,
          observations: form.observations || null,
        },
      }),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-energy-assessments"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-energy-assessments-by-client", form.client_id],
      });
      setForm(EMPTY);
      setOpen(false);
      onCreated?.(id);
    },
  });

  const field = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const canSubmit = form.client_id && form.date;

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Nouveau bilan
        </button>
      )}
      <DrawerContent className="bg-cream">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-forest">
              {bilan ? "Modifier le bilan énergétique" : "Nouveau bilan énergétique"}
            </DrawerTitle>
            <DrawerDescription>Saisir les valeurs par axe.</DrawerDescription>
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
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </select>
            </label>
            <DateField
              label="Date du bilan"
              value={form.date}
              onChange={(v) => field("date", v)}
              required
              className="sm:col-span-2"
            />

            <div className="sm:col-span-2">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-forest">
                Axes énergétiques (0-10)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {AXES.map((axe) => (
                  <label
                    key={axe.key}
                    className="flex items-center justify-between gap-2 rounded-lg bg-cream-warm/60 px-3 py-2 text-sm"
                  >
                    <span className="text-earth/80">{axe.label}</span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={form[axe.key]}
                      onChange={(e) => field(axe.key, Number(e.target.value))}
                      className="w-14 rounded-md border border-gold/25 bg-card px-2 py-1 text-right text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                  </label>
                ))}
              </div>
            </div>

            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Observations</span>
              <textarea
                rows={4}
                value={form.observations}
                onChange={(e) => field("observations", e.target.value)}
                placeholder="Ressentis, blocages, dynamiques…"
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
              {saveMutation.isPending
                ? "Enregistrement…"
                : bilan
                  ? "Enregistrer"
                  : "Créer le bilan"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-gold/30 px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
            >
              Annuler
            </button>
            {saveMutation.isError && (
              <span className="text-sm text-red-700">Erreur lors de l'enregistrement.</span>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
