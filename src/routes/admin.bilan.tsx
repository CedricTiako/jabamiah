import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "./admin";

export const Route = createFileRoute("/admin/bilan")({
  head: () => ({ meta: [{ title: "Bilan énergétique — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: BilanPage,
});

const axes = [
  { label: "Énergie générale", value: 7 },
  { label: "Stress", value: 3 },
  { label: "Émotions", value: 5 },
  { label: "Motivation", value: 4 },
  { label: "Confiance en soi", value: 6 },
  { label: "Fatigue", value: 7 },
  { label: "Douleurs", value: 2 },
  { label: "Concentration", value: 7 },
];

function BilanPage() {
  const { signOut } = useAdmin();
  return (
    <AdminShell title="Bilan énergétique" subtitle="Analyse détaillée par axe" onSignOut={signOut}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-xl text-forest">Roue de l'équilibre</h3>
          <div className="mt-5 space-y-4">
            {axes.map((a) => (
              <div key={a.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-earth/80">{a.label}</span>
                  <span className="font-medium text-forest">{a.value}/10</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-cream-warm">
                  <div className="h-full rounded-full bg-forest" style={{ width: `${a.value * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-xl text-forest">Chakras</h3>
          <ul className="mt-5 space-y-3">
            {[
              ["Racine", "#8B2E2E", 78], ["Sacré", "#D97706", 82], ["Plexus solaire", "#EAB308", 70],
              ["Cœur", "#16A34A", 85], ["Gorge", "#0891B2", 75], ["3ème œil", "#4338CA", 80], ["Couronne", "#7E22CE", 88],
            ].map(([name, color, v]) => (
              <li key={name as string} className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-full flex-shrink-0" style={{ backgroundColor: color as string }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-earth/80">{name}</span>
                    <span className="text-xs text-earth/60">{v}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-cream-warm">
                    <div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: color as string }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
