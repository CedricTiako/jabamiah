import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewBilanDrawer, type BilanRecord } from "../components/admin/new-bilan-drawer";
import { useAdmin } from "../lib/admin-context";
import { Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminDeleteEnergyAssessment,
  adminListEnergyAssessments,
} from "../lib/energy-assessments.functions";
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

export const Route = createFileRoute("/admin/bilan")({
  head: () => ({
    meta: [
      { title: "Bilan énergétique — Jabamiah Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: BilanPage,
});

const AXES = [
  { key: "axis_energie", label: "Énergie générale" },
  { key: "axis_stress", label: "Stress" },
  { key: "axis_emotions", label: "Émotions" },
  { key: "axis_motivation", label: "Motivation" },
  { key: "axis_confiance", label: "Confiance en soi" },
  { key: "axis_fatigue", label: "Fatigue" },
  { key: "axis_douleurs", label: "Douleurs" },
  { key: "axis_concentration", label: "Concentration" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function BilanPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BilanRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const listAssessments = useServerFn(adminListEnergyAssessments);
  const { data: assessments, isLoading } = useQuery({
    queryKey: ["admin-energy-assessments"],
    queryFn: () => listAssessments(),
  });

  const del = useServerFn(adminDeleteEnergyAssessment);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-energy-assessments"] });
      setPendingDelete(null);
      setSelectedId(null);
    },
  });

  const rows = assessments ?? [];
  const current = rows.find((a) => a.id === selectedId) ?? rows[0] ?? null;

  return (
    <AdminShell
      title="Bilan énergétique"
      subtitle="Analyse détaillée par axe"
      onSignOut={signOut}
      actions={<NewBilanDrawer />}
    >
      <NewBilanDrawer
        bilan={editing ?? undefined}
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
      />
      {isLoading && <p className="text-sm text-earth/60">Chargement…</p>}
      {!isLoading && rows.length === 0 && (
        <p className="rounded-xl bg-card p-6 text-center text-sm text-earth/60 ring-1 ring-gold/15">
          Aucun bilan pour le moment.
        </p>
      )}

      {!isLoading && rows.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-card p-4 ring-1 ring-gold/15 lg:col-span-1">
            <p className="mb-3 text-xs uppercase tracking-[0.15em] text-forest">Historique</p>
            <ul className="max-h-[420px] space-y-1 overflow-y-auto">
              {rows.map((a) => (
                <li key={a.id}>
                  <button
                    onClick={() => setSelectedId(a.id)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                      current?.id === a.id
                        ? "bg-forest text-cream"
                        : "text-earth/80 hover:bg-cream-warm"
                    }`}
                  >
                    <p className="font-medium">
                      {(a.clients as { full_name: string } | null)?.full_name ?? "Client"}
                    </p>
                    <p
                      className={`text-xs ${current?.id === a.id ? "text-cream/80" : "text-earth/60"}`}
                    >
                      {formatDate(a.assessment_date)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15 lg:col-span-2">
            {current && (
              <>
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-xl text-forest">
                    {(current.clients as { full_name: string } | null)?.full_name ?? "Client"}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-earth/60">
                      {formatDate(current.assessment_date)}
                    </span>
                    <button
                      onClick={() => setEditing(current as unknown as BilanRecord)}
                      className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-forest"
                      aria-label="Modifier"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setPendingDelete({
                          id: current.id,
                          name:
                            (current.clients as { full_name: string } | null)?.full_name ??
                            "ce client",
                        })
                      }
                      className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-red-700"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {AXES.map((axe) => {
                    const value = current[axe.key] as number;
                    return (
                      <div key={axe.key}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-earth/80">{axe.label}</span>
                          <span className="font-medium text-forest">{value}/10</span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-cream-warm">
                          <div
                            className="h-full rounded-full bg-forest"
                            style={{ width: `${value * 10}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {current.observations && (
                  <div className="mt-6 rounded-lg bg-cream-warm p-4 text-sm text-earth/80">
                    <p className="mb-1 text-xs uppercase tracking-[0.15em] text-forest">
                      Observations
                    </p>
                    <p className="whitespace-pre-wrap">{current.observations}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce bilan ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le bilan énergétique de « {pendingDelete?.name} » sera définitivement supprimé.
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
