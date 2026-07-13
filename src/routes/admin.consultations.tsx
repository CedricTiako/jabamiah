import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewConsultationDrawer } from "../components/admin/new-consultation-drawer";
import { useAdmin } from "../lib/admin-context";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListConsultations } from "../lib/consultations.functions";

export const Route = createFileRoute("/admin/consultations")({
  head: () => ({ meta: [{ title: "Consultations — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ConsultationsPage,
});

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ConsultationsPage() {
  const { signOut } = useAdmin();

  const listConsultations = useServerFn(adminListConsultations);
  const { data: consultations, isLoading } = useQuery({
    queryKey: ["admin-consultations"],
    queryFn: () => listConsultations(),
  });

  const rows = consultations ?? [];

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = rows.filter((r) => {
      const d = new Date(r.consultation_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const thisYear = rows.filter((r) => new Date(r.consultation_date).getFullYear() === now.getFullYear());
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {isLoading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-earth/60">Chargement…</td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-earth/60">Aucune consultation pour le moment.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-cream-warm/30">
                <td className="px-4 py-3 text-earth/80">{formatDateTime(r.consultation_date)}</td>
                <td className="px-4 py-3 font-medium text-forest">{(r.clients as { full_name: string } | null)?.full_name ?? "Client"}</td>
                <td className="px-4 py-3 text-earth/70">{r.duration_minutes} min</td>
                <td className="px-4 py-3 text-earth/70">{r.mood ? `${r.mood} / 10` : "—"}</td>
                <td className="px-4 py-3 max-w-xs truncate text-earth/70">{r.report}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
