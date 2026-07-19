import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { KpiCard, SectionCard, Pill } from "../components/admin/ui";
import { useAdmin } from "../lib/admin-context";
import { adminListPosts, adminListContactMessages } from "../lib/posts.functions";
import { adminListPayments } from "../lib/payments.functions";
import { adminListClients } from "../lib/clients.functions";
import { adminListAppointments } from "../lib/appointments.functions";
import { adminListConsultations } from "../lib/consultations.functions";
import {
  Users,
  CalendarDays,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Heart,
  Clock,
  Plus,
  Feather,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Jabamiah Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function today() {
  const d = new Date();
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_TONE: Record<string, "green" | "gold" | "rose" | "neutral"> = {
  Confirmé: "green",
  Planifié: "gold",
  Honoré: "green",
  Annulé: "rose",
  "No-show": "rose",
};

function AdminDashboard() {
  const { signOut } = useAdmin();
  const listPosts = useServerFn(adminListPosts);
  const listMessages = useServerFn(adminListContactMessages);
  const listPayments = useServerFn(adminListPayments);
  const listClients = useServerFn(adminListClients);
  const listAppointments = useServerFn(adminListAppointments);
  const listConsultations = useServerFn(adminListConsultations);

  const { data: posts } = useQuery({ queryKey: ["admin-posts"], queryFn: () => listPosts() });
  const { data: messages } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => listMessages(),
  });
  const { data: payments } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => listPayments(),
  });
  const { data: clients } = useQuery({ queryKey: ["admin-clients"], queryFn: () => listClients() });
  const { data: appointments } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => listAppointments(),
  });
  const { data: consultations } = useQuery({
    queryKey: ["admin-consultations"],
    queryFn: () => listConsultations(),
  });

  const draftCount = (posts ?? []).filter((p) => p.status === "draft").length;
  const publishedCount = (posts ?? []).filter((p) => p.status === "published").length;
  const messagesCount = messages?.length ?? 0;

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const succeededPayments = (payments ?? []).filter((p) => p.status === "succeeded");
  const monthTotal = succeededPayments
    .filter((p) => {
      const d = new Date(p.payment_date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((s, p) => s + p.amount, 0);
  const lastMonthTotal = succeededPayments
    .filter((p) => {
      const d = new Date(p.payment_date);
      return d.getFullYear() === lastMonth.getFullYear() && d.getMonth() === lastMonth.getMonth();
    })
    .reduce((s, p) => s + p.amount, 0);
  const monthDeltaPct =
    lastMonthTotal > 0 ? Math.round(((monthTotal - lastMonthTotal) / lastMonthTotal) * 100) : null;

  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcoming = (appointments ?? [])
    .filter((a) => new Date(a.starts_at) >= now && a.status !== "Annulé")
    .slice(0, 4);
  const weekCount = (appointments ?? []).filter((a) => {
    const d = new Date(a.starts_at);
    return d >= now && d <= weekAhead && a.status !== "Annulé";
  }).length;

  const activeClientsCount = (clients ?? []).filter((c) => c.status === "Actif").length;
  const newClientsThisMonth = (clients ?? []).filter((c) => {
    const d = new Date(c.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  const consultationsThisWeek = (consultations ?? []).filter((c) => {
    const d = new Date(c.consultation_date);
    return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) && d <= now;
  }).length;

  type ActivityItem = { text: string; when: string; date: Date };
  const activity: ActivityItem[] = [
    ...(messages ?? []).slice(0, 3).map((m) => ({
      text: `Nouveau message de ${m.name}`,
      when: new Date(m.created_at).toLocaleString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date(m.created_at),
    })),
    ...(consultations ?? []).slice(0, 3).map((c) => ({
      text: `Consultation ${c.clients?.full_name ?? ""} clôturée (compte-rendu ajouté)`.trim(),
      when: new Date(c.consultation_date).toLocaleString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
      date: new Date(c.consultation_date),
    })),
    ...succeededPayments.slice(0, 3).map((p) => ({
      text: `Don reçu — ${p.amount} €`,
      when: new Date(p.payment_date).toLocaleString("fr-FR", { day: "numeric", month: "short" }),
      date: new Date(p.payment_date),
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4);

  return (
    <AdminShell title="Tableau de bord" subtitle={today()} onSignOut={signOut}>
      {/* Hero — editorial welcome */}
      <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-forest to-forest-soft p-8 text-cream md:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cream/5 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.28em] text-cream/60">Bienvenue, Loïc</p>
            <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-[1.1] md:text-5xl">
              Prendre soin de l'autre,
              <br />
              <span className="text-gold">commence par s'organiser.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm text-cream/75">
              Vous avez <span className="text-cream">{weekCount} rendez-vous</span> cette semaine et{" "}
              <span className="text-cream">
                {messagesCount} message{messagesCount > 1 ? "s" : ""}
              </span>{" "}
              en attente.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/agenda"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-forest hover:bg-cream-warm"
            >
              <CalendarDays className="h-3.5 w-3.5" /> Agenda
            </Link>
            <Link
              to="/admin/clients"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-cream hover:bg-cream/10"
            >
              <Plus className="h-3.5 w-3.5" /> Nouveau client
            </Link>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard
          label="Clients actifs"
          value={String(activeClientsCount)}
          delta={`+${newClientsThisMonth} ce mois`}
          trend="up"
          icon={Users}
        />
        <KpiCard
          label="Consultations"
          value={String((consultations ?? []).length)}
          delta={`${consultationsThisWeek} cette semaine`}
          trend="up"
          icon={Sparkles}
        />
        <KpiCard
          label="Messages"
          value={String(messagesCount)}
          delta="via formulaire"
          icon={MessageSquare}
        />
        <KpiCard
          label="Nouveaux clients"
          value={String(newClientsThisMonth)}
          delta="ce mois-ci"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Main grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Upcoming appointments */}
        <SectionCard
          className="lg:col-span-2"
          eyebrow="À venir"
          title="Prochains rendez-vous"
          action={{ to: "/admin/agenda", label: "Tout voir" }}
        >
          {upcoming.length === 0 && (
            <p className="py-3.5 text-sm text-earth/60">Aucun rendez-vous à venir.</p>
          )}
          <ul className="divide-y divide-gold/10">
            {upcoming.map((r) => {
              const name = r.clients?.full_name ?? "Client";
              const time = new Date(r.starts_at).toLocaleString("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <li key={r.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest/8 font-serif text-sm text-forest ring-1 ring-forest/10">
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-forest">{name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-earth/60">
                        <Clock className="h-3 w-3" />
                        <span className="truncate">
                          {r.session_type ?? "Séance"} · {time}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Pill tone={STATUS_TONE[r.status] ?? "neutral"}>{r.status}</Pill>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        {/* Activity feed */}
        <SectionCard eyebrow="Journal" title="Activité récente">
          {activity.length === 0 && (
            <p className="text-sm text-earth/60">Aucune activité récente.</p>
          )}
          <ol className="relative space-y-4 border-l border-gold/20 pl-5">
            {activity.map((a, i) => (
              <li key={a.text + i} className="relative">
                <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-cream" />
                <p className="text-sm leading-snug text-earth/90">{a.text}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-earth/50">
                  <Clock className="h-3 w-3" /> {a.when}
                </p>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      {/* Second row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Content */}
        <SectionCard
          eyebrow="Publication"
          title="Contenu du blog"
          action={{ to: "/admin/contenu", label: "Gérer" }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-cream-warm/70 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-earth/55">Publiés</p>
              <p className="mt-2 font-serif text-3xl text-forest">{publishedCount}</p>
            </div>
            <div className="rounded-xl bg-cream-warm/70 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-earth/55">Brouillons</p>
              <p className="mt-2 font-serif text-3xl text-forest">{draftCount}</p>
            </div>
          </div>
          <Link
            to="/admin/posts/$id"
            params={{ id: "new" }}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-cream hover:bg-forest-soft"
          >
            <Feather className="h-3.5 w-3.5" /> Nouvel article
          </Link>
        </SectionCard>

        {/* Messages */}
        <SectionCard
          eyebrow="Boîte de réception"
          title="Messages reçus"
          action={{ to: "/admin/messages", label: "Ouvrir" }}
        >
          <div className="flex items-end justify-between">
            <p className="font-serif text-5xl leading-none text-forest">{messagesCount}</p>
            <MessageSquare className="h-6 w-6 text-gold" />
          </div>
          <p className="mt-3 text-xs text-earth/60">
            {messagesCount === 0
              ? "Aucun nouveau message."
              : "Depuis le formulaire de contact du site."}
          </p>
        </SectionCard>

        {/* Solidarity */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color:var(--rose-soft)] via-cream-warm to-cream p-6 ring-1 ring-gold/15">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[color:var(--rose-text)]/10 blur-2xl" />
          <div className="relative flex items-center gap-2">
            <Heart className="h-4 w-4 text-[color:var(--rose-text)]" />
            <p className="text-[10px] uppercase tracking-[0.22em] text-[color:var(--rose-text)]">
              Cagnotte solidaire
            </p>
          </div>
          <p className="relative mt-4 font-serif text-4xl text-[color:var(--rose-text)]">
            {monthTotal.toFixed(0)} €
          </p>
          <p className="relative mt-1 text-xs text-earth/70">collectés ce mois-ci</p>
          {monthDeltaPct !== null && (
            <div className="relative mt-3 flex items-center gap-2 text-xs text-earth/70">
              <TrendingUp className="h-3.5 w-3.5 text-[color:var(--rose-text)]" />
              <span>
                {monthDeltaPct >= 0 ? "+" : ""}
                {monthDeltaPct}% vs mois dernier
              </span>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
