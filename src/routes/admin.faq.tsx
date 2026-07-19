import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { Pill } from "../components/admin/ui";
import { useAdmin } from "../lib/admin-context";
import { adminDeleteFaq, adminListFaqs } from "../lib/faqs.functions";
import { NewFaqDrawer, type FaqRecord } from "../components/admin/new-faq-drawer";
import { Edit3, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export const Route = createFileRoute("/admin/faq")({
  head: () => ({ meta: [{ title: "FAQ — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: FaqPage,
});

function FaqPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<FaqRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; question: string } | null>(null);

  const list = useServerFn(adminListFaqs);
  const { data: faqs, isLoading } = useQuery({ queryKey: ["admin-faqs"], queryFn: () => list() });

  const del = useServerFn(adminDeleteFaq);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["public-faqs"] });
      setPendingDelete(null);
    },
  });

  const rows = faqs ?? [];

  return (
    <AdminShell
      title="FAQ"
      subtitle="Questions fréquentes affichées sur la page d'accueil"
      onSignOut={signOut}
      actions={<NewFaqDrawer />}
    >
      <NewFaqDrawer faq={editing ?? undefined} open={!!editing} onOpenChange={(v) => !v && setEditing(null)} />

      {isLoading && <p className="text-sm text-earth/60">Chargement…</p>}
      {!isLoading && rows.length === 0 && (
        <p className="rounded-xl bg-card p-6 text-center text-sm text-earth/60 ring-1 ring-gold/15">
          Aucune question pour le moment.
        </p>
      )}

      <div className="space-y-3">
        {rows.map((f) => (
          <div key={f.id} className="rounded-xl bg-card p-5 ring-1 ring-gold/15">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-forest">{f.question}</p>
                <p className="mt-1 text-sm text-earth/75 whitespace-pre-wrap">{f.answer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {f.published ? <Pill tone="green">Visible</Pill> : <Pill tone="neutral">Masquée</Pill>}
                <span className="text-xs text-earth/50">#{f.sort_order}</span>
                <button
                  onClick={() => setEditing(f)}
                  className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-forest"
                  aria-label="Modifier"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setPendingDelete({ id: f.id, question: f.question })}
                  className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-red-700"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette question ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {pendingDelete?.question} » sera définitivement supprimée de la FAQ publique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
              className="bg-red-700 text-white hover:bg-red-800"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
