import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewAppointmentDrawer } from "../components/admin/new-appointment-drawer";
import { useAdmin } from "./admin";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListAppointments, adminUpdateAppointmentStatus } from "../lib/appointments.functions";

export const Route = createFileRoute("/admin/agenda")({
  head: () => ({ meta: [{ title: "Agenda — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AgendaPage,
});

type AppointmentStatus = "Planifié" | "Confirmé" | "Annulé" | "Honoré" | "No-show";

const STATUSES: AppointmentStatus[] = ["Planifié", "Confirmé", "Annulé", "Honoré", "No-show"];

const statusTone: Record<AppointmentStatus, string> = {
  Planifié: "bg-earth/10 text-earth/70",
  Confirmé: "bg-forest/10 text-forest",
  Annulé: "bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]",
  Honoré: "bg-[color:var(--gold-soft)]/60 text-[color:var(--earth)]",
  "No-show": "bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]",
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  premiere: "Première consultation",
  suivi: "Suivi énergétique",
  bilan: "Bilan énergétique",
  harmonisation: "Harmonisation",
  guidance: "Guidance spirituelle",
};

const LOCATION_LABELS: Record<string, string> = {
  cabinet: "Cabinet — Rouen",
  distance: "À distance (visio)",
  domicile: "Au domicile du client",
};

function formatDayHeading(date: Date) {
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function AgendaPage() {
  const { signOut } = useAdmin();
  const queryClient = useQueryClient();

  const listAppointments = useServerFn(adminListAppointments);
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => listAppointments(),
  });

  const updateStatus = useServerFn(adminUpdateAppointmentStatus);
  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: AppointmentStatus }) => updateStatus({ data: vars }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-appointments"] }),
  });

  const rows = appointments ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, typeof rows>();
    for (const a of rows) {
      const day = new Date(a.starts_at).toDateString();
      map.set(day, [...(map.get(day) ?? []), a]);
    }
    return [...map.entries()].sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime(),
    );
  }, [rows]);

  const stats = useMemo(() => {
    const now = Date.now();
    const upcoming = rows.filter((a) => new Date(a.starts_at).getTime() >= now && a.status !== "Annulé");
    const hours = upcoming.reduce((sum, a) => sum + a.duration_minutes, 0) / 60;
    return {
      upcoming: upcoming.length,
      hours: hours.toFixed(1).replace(/\.0$/, ""),
      cabinet: upcoming.filter((a) => a.location === "cabinet").length,
      distance: upcoming.filter((a) => a.location === "distance").length,
    };
  }, [rows]);

  return (
    <AdminShell
      title="Agenda"
      subtitle="Rendez-vous à venir et passés"
      onSignOut={signOut}
      actions={<NewAppointmentDrawer />}
    >
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatBadge label="RDV à venir" value={String(stats.upcoming)} icon={CalendarDays} />
        <StatBadge label="Heures planifiées" value={`${stats.hours}h`} icon={Clock} />
        <StatBadge label="En cabinet" value={String(stats.cabinet)} icon={MapPin} />
        <StatBadge label="À distance" value={String(stats.distance)} icon={CalendarDays} />
      </div>

      <div className="space-y-6">
        {isLoading && <p className="text-sm text-earth/60">Chargement…</p>}
        {!isLoading && grouped.length === 0 && (
          <p className="rounded-xl bg-card p-6 text-center text-sm text-earth/60 ring-1 ring-gold/15">
            Aucun rendez-vous pour le moment.
          </p>
        )}
        {grouped.map(([day, dayAppointments]) => (
          <div key={day} className="rounded-xl bg-card ring-1 ring-gold/15">
            <div className="border-b border-gold/15 bg-cream-warm/60 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-forest">
              {formatDayHeading(new Date(day))}
            </div>
            <ul className="divide-y divide-gold/10">
              {dayAppointments.map((a) => {
                const status = (a.status as AppointmentStatus) ?? "Planifié";
                const clientName = (a.clients as { full_name: string } | null)?.full_name ?? "Client";
                return (
                  <li key={a.id} className="flex flex-wrap items-center gap-4 p-4">
                    <div className="w-16 flex-shrink-0 text-sm font-medium text-forest">
                      {formatTime(new Date(a.starts_at))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-forest">{clientName}</p>
                      <p className="text-xs text-earth/60">
                        {a.session_type ? SESSION_TYPE_LABELS[a.session_type] ?? a.session_type : "—"}
                        {" · "}
                        {a.duration_minutes} min
                        {" · "}
                        {a.location ? LOCATION_LABELS[a.location] ?? a.location : "—"}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${statusTone[status]}`}>
                      {status}
                    </span>
                    <select
                      value={status}
                      onChange={(e) => statusMutation.mutate({ id: a.id, status: e.target.value as AppointmentStatus })}
                      disabled={statusMutation.isPending}
                      className="rounded-md border border-gold/30 bg-card px-2 py-1.5 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

function StatBadge({ label, value, icon: Icon }: { label: string; value: string; icon: typeof CalendarDays }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-gold/15">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-forest/10 text-forest">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-earth/60">{label}</p>
        <p className="font-serif text-xl text-forest">{value}</p>
      </div>
    </div>
  );
}
