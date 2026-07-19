import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "../ui/drawer";
import { adminUpsertFaq } from "../../lib/faqs.functions";

export type FaqRecord = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
};

const EMPTY = {
  question: "",
  answer: "",
  sort_order: "0",
  published: true,
};

export function NewFaqDrawer({
  faq,
  open,
  onOpenChange,
}: {
  faq?: FaqRecord | null;
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
    if (faq) {
      setForm({
        question: faq.question,
        answer: faq.answer,
        sort_order: String(faq.sort_order),
        published: faq.published,
      });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, faq]);

  const upsert = useServerFn(adminUpsertFaq);
  const saveMutation = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          id: faq?.id ?? null,
          question: form.question,
          answer: form.answer,
          sort_order: form.sort_order ? parseInt(form.sort_order, 10) : 0,
          published: form.published,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["public-faqs"] });
      setOpen(false);
    },
  });

  const field = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      {!isControlled && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
        >
          <Plus className="h-3.5 w-3.5" /> Nouvelle question
        </button>
      )}
      <DrawerContent className="bg-cream">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-forest">
              {faq ? "Modifier la question" : "Nouvelle question"}
            </DrawerTitle>
            <DrawerDescription>Affichée dans la FAQ de la page d'accueil du site.</DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 px-4 pb-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Question *</span>
              <input
                value={form.question}
                onChange={(e) => field("question", e.target.value)}
                placeholder="Les consultations sont-elles gratuites ?"
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">Réponse *</span>
              <textarea
                rows={5}
                value={form.answer}
                onChange={(e) => field("answer", e.target.value)}
                className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.15em] text-forest">Ordre d'affichage</span>
                <input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) => field("sort_order", e.target.value)}
                  className="mt-1 w-full rounded-md border border-gold/30 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </label>
              <label className="flex items-center gap-2 self-end pb-2.5">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => field("published", e.target.checked)}
                  className="h-4 w-4 accent-forest"
                />
                <span className="text-sm text-forest">Visible sur le site</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-gold/15 px-4 py-4">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !form.question.trim() || !form.answer.trim()}
              className="rounded-md bg-forest px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft disabled:opacity-50"
            >
              {saveMutation.isPending ? "Enregistrement…" : faq ? "Enregistrer" : "Créer la question"}
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
