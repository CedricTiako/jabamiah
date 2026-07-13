import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "../lib/admin-context";
import { adminListConsultations } from "../lib/consultations.functions";
import { adminListClients } from "../lib/clients.functions";

export const Route = createFileRoute("/admin/statistiques")({
  head: () => ({ meta: [{ title: "Statistiques — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: StatsPage,
});

const SESSION_TYPE_LABELS: Record<string, string> = {
  premiere: "Première consultation",
  suivi: "Suivi énergétique",
  bilan: "Bilan énergétique",
  harmonisation: "Harmonisation",
  guidance: "Guidance spirituelle",
};

const SEGMENT_COLORS = ["bg-forest", "bg-[color:var(--gold)]", "bg-[color:var(--rose-text)]", "bg-forest-soft", "bg-earth/40"];

const MONTH_LABELS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "nouveau" : "stable";
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

function StatsPage() {
  const { signOut } = useAdmin();
  const listConsultations = useServerFn(adminListConsultations);
  const listClients = useServerFn(adminListClients);

  const { data: consultations, isLoading: loadingConsultations } = useQuery({
    queryKey: ["admin-consultations"],
    queryFn: () => listConsultations(),
  });
  const { data: clients, isLoading: loadingClients } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: () => listClients(),
  });

  const isLoading = loadingConsultations || loadingClients;

  const now = new Date();
  const last12Start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const prior12Start = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);

  const consultationsLast12 = (consultations ?? []).filter((c) => new Date(c.consultation_date) >= last12Start).length;
  const consultationsPrior12 = (consultations ?? []).filter((c) => {
    const d = new Date(c.consultation_date);
    return d >= prior12Start && d < last12Start;
  }).length;

  const newClientsLast12 = (clients ?? []).filter((c) => new Date(c.created_at) >= last12Start).length;
  const newClientsPrior12 = (clients ?? []).filter((c) => {
    const d = new Date(c.created_at);
    return d >= prior12Start && d < last12Start;
  }).length;

  const consultationsByClient = new Map<string, number>();
  for (const c of consultations ?? []) {
    consultationsByClient.set(c.client_id, (consultationsByClient.get(c.client_id) ?? 0) + 1);
  }
  const clientsWithConsultation = consultationsByClient.size;
  const returningClients = [...consultationsByClient.values()].filter((n) => n >= 2).length;
  const retourRate = clientsWithConsultation > 0 ? Math.round((returningClients / clientsWithConsultation) * 100) : 0;

  const totalClients = clients?.length ?? 0;

  const kpis = [
    { label: "Consultations (12 mois)", value: String(consultationsLast12), delta: pctChange(consultationsLast12, consultationsPrior12) },
    { label: "Nouveaux clients (12 mois)", value: String(newClientsLast12), delta: pctChange(newClientsLast12, newClientsPrior12) },
    { label: "Taux de retour", value: `${retourRate}%`, delta: `${returningClients}/${clientsWithConsultation} clients` },
    { label: "Total clients", value: String(totalClients), delta: "au total" },
  ];

  const monthlyCounts = Array(12).fill(0) as number[];
  for (const c of consultations ?? []) {
    const d = new Date(c.consultation_date);
    if (d.getFullYear() === now.getFullYear()) monthlyCounts[d.getMonth()]++;
  }
  const maxMonthly = Math.max(1, ...monthlyCounts);

  const typeCounts = new Map<string, number>();
  for (const c of consultations ?? []) {
    const type = c.appointments?.session_type ?? "autre";
    typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
  }
  const totalTyped = [...typeCounts.values()].reduce((s, n) => s + n, 0);
  const breakdown = [...typeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({
      name: SESSION_TYPE_LABELS[type] ?? "Autre",
      pct: totalTyped > 0 ? Math.round((count / totalTyped) * 100) : 0,
    }));

  return (
    <AdminShell title="Statistiques" subtitle="Vue analytique de votre activité" onSignOut={signOut}>
      {isLoading && <p className="text-sm text-earth/60">Chargement…</p>}

      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl bg-card p-5 ring-1 ring-gold/15">
            <p className="text-xs uppercase tracking-[0.15em] text-earth/60">{k.label}</p>
            <p className="mt-2 font-serif text-3xl text-forest">{k.value}</p>
            <p className="mt-1 text-xs text-gold">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-xl text-forest">Consultations par mois ({now.getFullYear()})</h3>
          <div className="mt-6 flex h-56 items-end gap-2">
            {monthlyCounts.map((v, i) => (
              <div key={i} className="flex-1">
                <div className="rounded-t bg-forest" style={{ height: `${(v / maxMonthly) * 100}%` }} />
                <p className="mt-1 text-center text-[10px] text-earth/60">{MONTH_LABELS[i]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-xl text-forest">Répartition des soins</h3>
          {breakdown.length === 0 && <p className="mt-6 text-sm text-earth/60">Pas encore de données.</p>}
          <ul className="mt-6 space-y-3">
            {breakdown.map((b, i) => (
              <li key={b.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-earth/80">{b.name}</span>
                  <span className="text-forest font-medium">{b.pct}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-cream-warm">
                  <div className={`h-full rounded-full ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}`} style={{ width: `${b.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
