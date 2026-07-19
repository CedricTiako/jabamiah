import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import {
  NewConsultationDrawer,
  type ConsultationRecord,
} from "../components/admin/new-consultation-drawer";
import { useAdmin } from "../lib/admin-context";
import { Edit3, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminDeleteConsultation, adminListConsultations } from "../lib/consultations.functions";
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

export const Route = createFileRoute("/admin/consultations")({
  head: () => ({
    meta: [
      { title: "Consultations — Jabamiah Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ConsultationsPage,
});

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ConsultationsPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ConsultationRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const listConsultations = useServerFn(adminListConsultations);
  const { data: consultations, isLoading } = useQuery({
    queryKey: ["admin-consultations"],
    queryFn: () => listConsultations(),
  });

  const del = useServerFn(adminDeleteConsultation);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-consultations"] });
      setPendingDelete(null);
    },
  });

  const rows = useMemo(() => consultations ?? [], [consultations]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = rows.filter((r) => {
      const d = new Date(r.consultation_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const thisYear = rows.filter(
      (r) => new Date(r.consultation_date).getFullYear() === now.getFullYear(),
    );
    const uniqueClients = new Set(rows.map((r) => r.client_id)).size;
    return { thisMonth: thisMonth.length, thisYear: thisYear.length, uniqueClients };
  }, [rows]);

  return (
    <AdminShell
      title="Consultations"
      subtitle="Tous vos comptes-rendus de séance"
      onSignOut={signOut}
      actions={<NewConsultationDrawer />}
    >
      <NewConsultationDrawer
        consultation={editing ?? undefined}
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
      />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {[
          ["Ce mois", String(stats.thisMonth)],
          ["Cette année", String(stats.thisYear)],
          ["Clients suivis", String(stats.uniqueClients)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-card p-4 ring-1 ring-gold/15">
            <p className="text-xs uppercase tracking-[0.15em] text-earth/60">{k}</p>
            <p className="mt-1 font-serif text-2xl text-forest">{v}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-gold/15">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-cream-warm/60 text-left text-xs uppercase tracking-[0.15em] text-forest">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Durée</th>
              <th className="px-4 py-3">Ressenti</th>
              <th className="px-4 py-3">Compte-rendu</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-earth/60">
                  Chargement…
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-earth/60">
                  Aucune consultation pour le moment.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const clientName = (r.clients as { full_name: string } | null)?.full_name ?? "Client";
              return (
                <tr key={r.id} className="hover:bg-cream-warm/30">
                  <td className="px-4 py-3 text-earth/80">{formatDateTime(r.consultation_date)}</td>
                  <td className="px-4 py-3 font-medium text-forest">{clientName}</td>
                  <td className="px-4 py-3 text-earth/70">{r.duration_minutes} min</td>
                  <td className="px-4 py-3 text-earth/70">{r.mood ? `${r.mood} / 10` : "—"}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-earth/70">{r.report}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(r as unknown as ConsultationRecord)}
                        className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-forest"
                        aria-label="Modifier"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setPendingDelete({ id: r.id, name: clientName })}
                        className="rounded-md p-1.5 text-earth/40 hover:bg-cream-warm hover:text-red-700"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(v) => !v && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette consultation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte-rendu de « {pendingDelete?.name} » sera définitivement supprimé.
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
