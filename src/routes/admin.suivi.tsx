import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "./admin";

export const Route = createFileRoute("/admin/suivi")({
  head: () => ({ meta: [{ title: "Suivi & Évolution — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: SuiviPage,
});

const clients = [
  { name: "Sophie Martin", score: 78, sessions: 12, trend: "+18%" },
  { name: "Julien Dupont", score: 62, sessions: 6, trend: "+9%" },
  { name: "Antoine Bernard", score: 70, sessions: 4, trend: "+12%" },
  { name: "Camille Robert", score: 85, sessions: 18, trend: "+22%" },
];

function SuiviPage() {
  const { signOut } = useAdmin();
  return (
    <AdminShell title="Suivi & Évolution" subtitle="Progression globale de vos clients" onSignOut={signOut}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {clients.map((c) => (
          <div key={c.name} className="rounded-xl bg-card p-5 ring-1 ring-gold/15">
            <p className="text-sm font-medium text-forest">{c.name}</p>
            <p className="text-xs text-earth/60">{c.sessions} séances</p>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="font-serif text-3xl text-forest">{c.score}%</p>
              <span className="text-xs text-[color:var(--gold)]">{c.trend}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-cream-warm">
              <div className="h-full rounded-full bg-forest" style={{ width: `${c.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-card p-6 ring-1 ring-gold/15">
        <h3 className="font-serif text-xl text-forest">Évolution globale (12 derniers mois)</h3>
        <div className="mt-6 flex h-48 items-end gap-2">
          {[42, 48, 52, 58, 55, 62, 65, 70, 68, 72, 78, 82].map((v, i) => (
            <div key={i} className="flex-1">
              <div className="rounded-t bg-gradient-to-t from-forest to-forest-soft" style={{ height: `${v}%` }} />
              <p className="mt-1 text-center text-[10px] text-earth/60">
                {["Jul", "Aoû", "Sep", "Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Jun"][i]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
