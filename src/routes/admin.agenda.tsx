import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "../components/admin/admin-shell";
import { NewAppointmentDrawer } from "../components/admin/forms";
import { useAdmin } from "./admin";
import { CalendarDays, Plus, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/admin/agenda")({
  head: () => ({ meta: [{ title: "Agenda — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AgendaPage,
});

const days = ["Lun 30", "Mar 01", "Mer 02", "Jeu 03", "Ven 04", "Sam 05", "Dim 06"];
const hours = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

const events: Record<string, { title: string; who: string; tone: "green" | "gold" | "rose" }> = {
  "Mar 01-10:00": { title: "Consultation", who: "Sophie Martin", tone: "green" },
  "Mar 01-15:00": { title: "Bilan", who: "Julien Dupont", tone: "gold" },
  "Mer 02-11:00": { title: "Harmonisation", who: "Marie Leroy", tone: "green" },
  "Jeu 03-14:00": { title: "Suivi", who: "Antoine B.", tone: "green" },
  "Jeu 03-16:00": { title: "Première consult.", who: "Nora K.", tone: "rose" },
  "Ven 04-10:00": { title: "Consultation", who: "Julien Dupont", tone: "green" },
  "Ven 04-16:00": { title: "Première consult.", who: "Marie Leroy", tone: "rose" },
  "Sam 05-09:00": { title: "Bilan", who: "Antoine B.", tone: "gold" },
};

const toneClass: Record<"green" | "gold" | "rose", string> = {
  green: "bg-forest text-cream",
  gold: "bg-[color:var(--gold)] text-[color:var(--earth)]",
  rose: "bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]",
};

function AgendaPage() {
  const { signOut } = useAdmin();
  return (
    <AdminShell
      title="Agenda"
      subtitle="Semaine du 30 juin au 6 juillet 2026"
      onSignOut={signOut}
      actions={
        <NewAppointmentDrawer>
          {(open) => (
            <button
              onClick={open}
              className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
            >
              <Plus className="h-3.5 w-3.5" /> Nouveau RDV
            </button>
          )}
        </NewAppointmentDrawer>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatBadge label="Cette semaine" value="12" icon={CalendarDays} />
        <StatBadge label="Heures planifiées" value="14h" icon={Clock} />
        <StatBadge label="En cabinet" value="8" icon={MapPin} />
        <StatBadge label="À distance" value="4" icon={CalendarDays} />
      </div>

      <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-gold/15">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-gold/15 bg-cream-warm/60 text-xs uppercase tracking-[0.15em] text-forest">
              <th className="w-20 px-3 py-3 text-left">Heure</th>
              {days.map((d) => (
                <th key={d} className="px-3 py-3 text-left">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((h) => (
              <tr key={h} className="border-b border-gold/10 last:border-0">
                <td className="px-3 py-3 text-xs text-earth/70">{h}</td>
                {days.map((d) => {
                  const ev = events[`${d}-${h}`];
                  return (
                    <td key={d + h} className="align-top px-2 py-2">
                      {ev ? (
                        <div className={`rounded-md px-2 py-2 text-[11px] ${toneClass[ev.tone]}`}>
                          <p className="font-medium">{ev.title}</p>
                          <p className="opacity-90">{ev.who}</p>
                        </div>
                      ) : (
                        <div className="h-12 rounded-md border border-dashed border-gold/20" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
