import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "../lib/admin-context";
import { adminListEnergyAssessments } from "../lib/energy-assessments.functions";
import { adminListConsultations } from "../lib/consultations.functions";

export const Route = createFileRoute("/admin/suivi")({
  head: () => ({
    meta: [
      { title: "Suivi & Évolution — Jabamiah Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuiviPage,
});

const AXES = [
  "axis_energie",
  "axis_stress",
  "axis_emotions",
  "axis_motivation",
  "axis_confiance",
  "axis_fatigue",
  "axis_douleurs",
  "axis_concentration",
] as const;

// Composite score = average of the 8 axes (0-10) scaled to a percentage.
// Axes aren't inverted (stress/fatigue/douleurs count the same direction as énergie/motivation) —
// this mirrors how the bilan énergétique form itself presents the axes, not a clinical index.
function compositeScore(a: Record<(typeof AXES)[number], number>): number {
  const sum = AXES.reduce((s, k) => s + a[k], 0);
  return Math.round((sum / AXES.length) * 10);
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function SuiviPage() {
  const { signOut } = useAdmin();
  const listAssessments = useServerFn(adminListEnergyAssessments);
  const listConsultations = useServerFn(adminListConsultations);

  const { data: assessments, isLoading: loadingAssessments } = useQuery({
    queryKey: ["admin-energy-assessments"],
    queryFn: () => listAssessments(),
  });
  const { data: consultations, isLoading: loadingConsultations } = useQuery({
    queryKey: ["admin-consultations"],
    queryFn: () => listConsultations(),
  });

  const isLoading = loadingAssessments || loadingConsultations;

  const sessionsByClient = new Map<string, number>();
  for (const c of consultations ?? []) {
    sessionsByClient.set(c.client_id, (sessionsByClient.get(c.client_id) ?? 0) + 1);
  }

  // Assessments are ordered by assessment_date desc, so the first entry per client is the latest.
  const byClient = new Map<string, { name: string; rows: typeof assessments }>();
  for (const a of assessments ?? []) {
    const key = a.client_id;
    if (!byClient.has(key)) byClient.set(key, { name: a.clients?.full_name ?? "Client", rows: [] });
    byClient.get(key)!.rows!.push(a);
  }

  const clientProgress = [...byClient.entries()].map(([clientId, { name, rows }]) => {
    const latest = rows![0];
    const previous = rows![1];
    const score = compositeScore(latest as unknown as Record<(typeof AXES)[number], number>);
    const trend =
      previous != null
        ? score - compositeScore(previous as unknown as Record<(typeof AXES)[number], number>)
        : null;
    return {
      clientId,
      name,
      score,
      sessions: sessionsByClient.get(clientId) ?? 0,
      trend,
    };
  });

  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: monthKey(d), label: d.toLocaleDateString("fr-FR", { month: "short" }) });
  }
  const scoresByMonth = new Map<string, number[]>();
  for (const a of assessments ?? []) {
    const key = monthKey(new Date(a.assessment_date));
    const score = compositeScore(a as unknown as Record<(typeof AXES)[number], number>);
    if (!scoresByMonth.has(key)) scoresByMonth.set(key, []);
    scoresByMonth.get(key)!.push(score);
  }
  const monthlyAverages = months.map((m) => {
    const scores = scoresByMonth.get(m.key) ?? [];
    return scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  });

  return (
    <AdminShell
      title="Suivi & Évolution"
      subtitle="Progression globale de vos clients"
      onSignOut={signOut}
    >
      {isLoading && <p className="text-sm text-earth/60">Chargement…</p>}
      {!isLoading && clientProgress.length === 0 && (
        <p className="text-sm text-earth/60">Aucun bilan énergétique enregistré pour l'instant.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {clientProgress.map((c) => (
          <div key={c.clientId} className="rounded-xl bg-card p-5 ring-1 ring-gold/15">
            <p className="text-sm font-medium text-forest">{c.name}</p>
            <p className="text-xs text-earth/60">
              {c.sessions} séance{c.sessions > 1 ? "s" : ""}
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="font-serif text-3xl text-forest">{c.score}%</p>
              {c.trend !== null && (
                <span className="text-xs text-gold">
                  {c.trend >= 0 ? "+" : ""}
                  {c.trend} pts
                </span>
              )}
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
          {monthlyAverages.map((v, i) => (
            <div key={i} className="flex-1">
              <div
                className="rounded-t bg-linear-to-t from-forest to-forest-soft"
                style={{ height: `${v}%` }}
              />
              <p className="mt-1 text-center text-[10px] text-earth/60">{months[i].label}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
