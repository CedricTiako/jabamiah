import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { adminUpsertProtocol } from "../../lib/protocols.functions";

const CATEGORIES = [
  { value: "energetique", label: "Énergétique" },
  { value: "meditation", label: "Méditation" },
  { value: "respiration", label: "Respiration" },
  { value: "harmonisation", label: "Harmonisation" },
  { value: "purification", label: "Purification" },
] as const;

export type ProtocolRecord = {
  id: string;
  name: string;
  description: string;
  category: string | null;
  duration_minutes: number | null;
  steps: string | null;
  warnings: string | null;
};

const EMPTY = {
  name: "",
  description: "",
  category: "" as string,
  duration_minutes: "45",
  steps: "",
  warnings: "",
};

export function NewProtocolDrawer({
  protocol,
  open,
  onOpenChange,
}: {
  protocol?: ProtocolRecord | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = (v: boolean) => (isControlled ? onOpenChange?.(v) : setInternalOpen(v));

  const [form, setForm] = useState(EMPTY);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isOpen) return;
    if (protocol) {
      setForm({
        name: protocol.name,
        description: protocol.description,
        category: protocol.category ?? "",
        duration_minutes: protocol.duration_minutes != null ? String(protocol.duration_minutes) : "45",
        steps: protocol.steps ?? "",
        warnings: protocol.warnings ?? "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, protocol]);

  const upsert = useServerFn(adminUpsertProtocol);
  const saveMutation = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          id: protocol?.id ?? null,
          name: form.name,
          description: form.description,
          category: (form.category || null) as
            | "energetique"
            | "meditation"
            | "respiration"
            | "harmonisation"
            | "purification"
            | null,
          duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes, 10) : null,
          steps: form.steps || null,
          warnings: form.warnings || null,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-protocols"] });
      setOpen(false);
    },
  });

  const field = (key: keyof typeof form, value: string) => setForm((s) => ({ ...s, [key]: value }));

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Nouveau protocole
        </button>
      )}
      <DrawerContent className="bg-cream">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-forest">
              {protocol ? "Modifier le protocole" : "Nouveau protocole"}
            </DrawerTitle>
            <DrawerDescription>Ajouter ou ajuster un rituel ou une technique de votre bibliothèque.</DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Nom du protocole *</span>
              <input
                value={form.name}
                onChange={(e) => field("name", e.target.value)}
                placeholder="Nettoyage énergétique"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Description courte *</span>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => field("description", e.target.value)}
                placeholder="Rituel de purification en 4 étapes"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Catégorie</span>
              <select
                value={form.category}
                onChange={(e) => field("category", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="">—</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Durée (min)</span>
              <input
                type="number"
                min={0}
                value={form.duration_minutes}
                onChange={(e) => field("duration_minutes", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Étapes détaillées</span>
              <textarea
                rows={6}
                value={form.steps}
                onChange={(e) => field("steps", e.target.value)}
                placeholder={"1. …\n2. …\n3. …"}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Contre-indications</span>
              <textarea
                rows={2}
                value={form.warnings}
                onChange={(e) => field("warnings", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
          </div>

          <div className="flex items-center gap-4 border-t border-gold/15 px-4 py-4">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.name.trim() || !form.description.trim()}
              className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-50"
            >
              {saveMutation.isPending ? "Enregistrement…" : protocol ? "Enregistrer" : "Créer le protocole"}
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
