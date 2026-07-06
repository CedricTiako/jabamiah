import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewConsultationDrawer } from "../components/admin/forms";
import { useAdmin } from "./admin";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/consultations")({
  head: () => ({ meta: [{ title: "Consultations — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ConsultationsPage,
});

const rows = [
  { date: "18/05/2024 · 14h00", client: "Sophie Martin", type: "Suivi énergétique", duration: "1h00", mood: "Bien 7/10", state: "Terminée" },
  { date: "18/05/2024 · 16h30", client: "Julien Dupont", type: "Bilan énergétique", duration: "1h30", mood: "Bien 6/10", state: "Terminée" },
  { date: "17/05/2024 · 10h00", client: "Marie Leroy", type: "Première consultation", duration: "1h30", mood: "Moyen 5/10", state: "Terminée" },
  { date: "16/05/2024 · 15h00", client: "Antoine Bernard", type: "Suivi énergétique", duration: "1h00", mood: "Bien 7/10", state: "Terminée" },
  { date: "Demain · 14h00", client: "Sophie Martin", type: "Suivi énergétique", duration: "1h00", mood: "—", state: "Planifiée" },
  { date: "04/07/2024 · 10h30", client: "Julien Dupont", type: "Consultation", duration: "1h00", mood: "—", state: "Planifiée" },
];

function ConsultationsPage() {
  const { signOut } = useAdmin();
  return (
    <AdminShell
      title="Consultations"
      subtitle="Toutes vos séances passées et à venir"
      onSignOut={signOut}
      actions={
        <button className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft">
          <Plus className="h-3.5 w-3.5" /> Nouvelle consultation
        </button>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Ce mois", "24"], ["Cette année", "152"], ["Nouveaux clients", "6"], ["Taux de retour", "78%"],
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
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Durée</th>
              <th className="px-4 py-3">Ressenti</th>
              <th className="px-4 py-3">État</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-cream-warm/30">
                <td className="px-4 py-3 text-earth/80">{r.date}</td>
                <td className="px-4 py-3 font-medium text-forest">{r.client}</td>
                <td className="px-4 py-3 text-earth/80">{r.type}</td>
                <td className="px-4 py-3 text-earth/70">{r.duration}</td>
                <td className="px-4 py-3 text-earth/70">{r.mood}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${r.state === "Terminée" ? "bg-forest/10 text-forest" : "bg-[color:var(--gold-soft)]/60 text-[color:var(--earth)]"}`}>{r.state}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
