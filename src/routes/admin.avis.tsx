import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { Pill } from "../components/admin/ui";
import { useAdmin } from "../lib/admin-context";
import { adminDeleteReview, adminListReviews, adminModerateReview } from "../lib/reviews.functions";
import { Star, Check, X, Trash2 } from "lucide-react";
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

export const Route = createFileRoute("/admin/avis")({
  head: () => ({
    meta: [
      { title: "Avis clients — Jabamiah Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AvisPage,
});

const TABS = ["En attente", "Approuvés", "Refusés"] as const;
const TAB_STATUS: Record<(typeof TABS)[number], string> = {
  "En attente": "pending",
  Approuvés: "approved",
  Refusés: "rejected",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-gold text-gold" : "text-earth/25"}`}
        />
      ))}
    </div>
  );
}

function AvisPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number]>("En attente");
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const list = useServerFn(adminListReviews);
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => list(),
  });

  const moderate = useServerFn(adminModerateReview);
  const moderateMutation = useMutation({
    mutationFn: (vars: { id: string; status: "approved" | "rejected" }) => moderate({ data: vars }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const del = useServerFn(adminDeleteReview);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      setPendingDelete(null);
    },
  });

  const rows = (reviews ?? []).filter((r) => r.status === TAB_STATUS[tab]);
  const pendingCount = (reviews ?? []).filter((r) => r.status === "pending").length;

  return (
    <AdminShell
      title="Avis clients"
      subtitle="Modération des témoignages soumis publiquement"
      onSignOut={signOut}
    >
      <div className="mb-6 flex gap-1 border-b border-gold/15">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm transition ${
              tab === t
                ? "border-gold font-medium text-forest"
                : "border-transparent text-earth/60 hover:text-forest"
            }`}
          >
            {t}
            {t === "En attente" && pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-forest px-1.5 py-0.5 text-[10px] text-cream">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-earth/60">Chargement…</p>}
      {!isLoading && rows.length === 0 && (
        <p className="rounded-xl bg-card p-6 text-center text-sm text-earth/60 ring-1 ring-gold/15">
          Aucun avis dans cette catégorie.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl bg-card p-5 ring-1 ring-gold/15">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-forest">{r.author_name}</p>
                <p className="text-xs text-earth/60">
                  {formatDate(r.created_at)}
                  {r.author_email ? ` · ${r.author_email}` : ""}
                </p>
              </div>
              <Stars rating={r.rating} />
            </div>
            <p className="mt-3 text-sm text-earth/80 whitespace-pre-wrap">{r.body}</p>
            <div className="mt-4 flex items-center gap-2">
              {r.status === "pending" && (
                <>
                  <button
                    onClick={() => moderateMutation.mutate({ id: r.id, status: "approved" })}
                    disabled={moderateMutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-md bg-forest px-3 py-2 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
                  >
                    <Check className="h-3.5 w-3.5" /> Approuver
                  </button>
                  <button
                    onClick={() => moderateMutation.mutate({ id: r.id, status: "rejected" })}
                    disabled={moderateMutation.isPending}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gold/30 px-3 py-2 text-xs uppercase tracking-[0.15em] text-forest hover:bg-cream-warm"
                  >
                    <X className="h-3.5 w-3.5" /> Refuser
                  </button>
                </>
              )}
              {r.status === "approved" && <Pill tone="green">Publié sur /temoignages</Pill>}
              {r.status === "rejected" && <Pill tone="rose">Refusé</Pill>}
              <button
                onClick={() => setPendingDelete({ id: r.id, name: r.author_name })}
                className="ml-auto rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-red-700"
                aria-label="Supprimer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet avis ?</AlertDialogTitle>
            <AlertDialogDescription>
              L'avis de « {pendingDelete?.name} » sera définitivement supprimé.
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
