import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "../lib/admin-context";

export const Route = createFileRoute("/admin/statistiques")({
  head: () => ({ meta: [{ title: "Statistiques — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: StatsPage,
});

function StatsPage() {
  const { signOut } = useAdmin();
  return (
    <AdminShell title="Statistiques" subtitle="Vue analytique de votre activité" onSignOut={signOut}>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Consultations 2024", "152", "+24%"],
          ["Nouveaux clients", "28", "+12%"],
          ["Taux de retour", "78%", "+6%"],
          ["Satisfaction moyenne", "4.9/5", "+0.2"],
        ].map(([k, v, d]) => (
          <div key={k} className="rounded-xl bg-card p-5 ring-1 ring-gold/15">
            <p className="text-xs uppercase tracking-[0.15em] text-earth/60">{k}</p>
            <p className="mt-2 font-serif text-3xl text-forest">{v}</p>
            <p className="mt-1 text-xs text-[color:var(--gold)]">{d} sur 12 mois</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-xl text-forest">Consultations par mois</h3>
          <div className="mt-6 flex h-56 items-end gap-2">
            {[8, 10, 12, 11, 14, 12, 15, 18, 16, 19, 22, 24].map((v, i) => (
              <div key={i} className="flex-1">
                <div className="rounded-t bg-forest" style={{ height: `${v * 3}%` }} />
                <p className="mt-1 text-center text-[10px] text-earth/60">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-xl text-forest">Répartition des soins</h3>
          <ul className="mt-6 space-y-3">
            {[
              ["Soins énergétiques", 42, "bg-forest"],
              ["Harmonisation", 28, "bg-[color:var(--gold)]"],
              ["Guidance spirituelle", 15, "bg-[color:var(--rose-text)]"],
              ["Plantes & remèdes", 10, "bg-forest-soft"],
              ["Autre", 5, "bg-earth/40"],
            ].map(([name, pct, color]) => (
              <li key={name as string}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-earth/80">{name}</span>
                  <span className="text-forest font-medium">{pct}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-cream-warm">
                  <div className={`h-full rounded-full ${color as string}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
