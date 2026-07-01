import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "../components/admin/admin-shell";
import { useAdmin } from "./admin";
import { adminListPosts, adminListContactMessages } from "../lib/posts.functions";
import {
  Users,
  CalendarDays,
  Sparkles,
  FolderClosed,
  TrendingUp,
  Heart,
  Clock,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Tableau de bord — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminDashboard,
});

const stats = [
  { label: "Clients actifs", value: "28", delta: "+3 ce mois", icon: Users, tint: "bg-forest/10 text-forest" },
  { label: "Consultations", value: "152", delta: "12 cette semaine", icon: Sparkles, tint: "bg-gold/15 text-[color:var(--earth)]" },
  { label: "Documents", value: "36", delta: "8 en attente", icon: FolderClosed, tint: "bg-forest/10 text-forest" },
  { label: "Satisfaction", value: "4.9/5", delta: "24 avis", icon: Star, tint: "bg-gold/15 text-[color:var(--earth)]" },
];

const upcoming = [
  { name: "Sophie Martin", time: "Demain · 14h00", type: "Consultation énergétique", state: "Confirmé" },
  { name: "Julien Dupont", time: "Ven. 04/07 · 10h30", type: "Suivi harmonisation", state: "Confirmé" },
  { name: "Marie Leroy", time: "Ven. 04/07 · 16h00", type: "Première consultation", state: "À valider" },
  { name: "Antoine Bernard", time: "Sam. 05/07 · 09h30", type: "Bilan énergétique", state: "Confirmé" },
];

const activity = [
  { text: "Nouveau message de Sophie Martin", when: "Il y a 12 min", tone: "message" },
  { text: "Consultation Julien Dupont clôturée (compte-rendu ajouté)", when: "Il y a 2 h", tone: "consult" },
  { text: "Don reçu — 25 €", when: "Il y a 5 h", tone: "don" },
  { text: "Nouvel avis 5★ publié", when: "Hier", tone: "avis" },
];

function AdminDashboard() {
  const { signOut } = useAdmin();
  const listPosts = useServerFn(adminListPosts);
  const listMessages = useServerFn(adminListContactMessages);

  const { data: posts } = useQuery({ queryKey: ["admin-posts"], queryFn: () => listPosts() });
  const { data: messages } = useQuery({ queryKey: ["admin-messages"], queryFn: () => listMessages() });

  const draftCount = (posts ?? []).filter((p) => p.status === "draft").length;
  const publishedCount = (posts ?? []).filter((p) => p.status === "published").length;
  const messagesCount = messages?.length ?? 0;

  return (
    <AdminShell
      title="Tableau de bord"
      subtitle="Vue d'ensemble de votre activité"
      onSignOut={signOut}
    >
      {/* Welcome hero */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl bg-gradient-to-br from-forest to-forest-soft p-6 text-cream md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cream/70">Bienvenue, Loïc</p>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">Prendre soin de l'autre,<br />commence par s'organiser.</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/agenda"
            className="rounded-md bg-cream px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-forest hover:bg-cream-warm"
          >
            Voir l'agenda
          </Link>
          <Link
            to="/admin/clients"
            className="rounded-md border border-cream/40 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-cream hover:bg-cream/10"
          >
            Nouveau client
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl bg-card p-5 ring-1 ring-gold/15">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${s.tint}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.15em] text-earth/60">{s.label}</p>
              <p className="mt-1 font-serif text-3xl text-forest">{s.value}</p>
              <p className="mt-1 text-xs text-earth/60">{s.delta}</p>
            </div>
          );
        })}
      </div>

      {/* Two columns */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Upcoming */}
        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-forest">Prochains rendez-vous</h3>
            <Link to="/admin/agenda" className="text-xs uppercase tracking-[0.15em] text-gold hover:text-forest">
              Tout voir →
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-gold/10">
            {upcoming.map((r) => (
              <li key={r.name + r.time} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-forest/10 text-forest">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-forest">{r.name}</p>
                    <p className="text-xs text-earth/60">{r.type} · {r.time}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${
                  r.state === "Confirmé" ? "bg-forest/10 text-forest" : "bg-[color:var(--gold-soft)]/50 text-[color:var(--earth)]"
                }`}>{r.state}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity feed */}
        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <h3 className="font-serif text-xl text-forest">Activité récente</h3>
          <ul className="mt-5 space-y-4">
            {activity.map((a) => (
              <li key={a.text} className="flex gap-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
                <div>
                  <p className="text-sm text-earth/90">{a.text}</p>
                  <p className="mt-0.5 text-xs text-earth/50 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {a.when}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Second row: content + KPI */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-forest">Contenu (Blog)</h3>
            <Link to="/admin/contenu" className="text-xs uppercase tracking-[0.15em] text-gold hover:text-forest">
              Gérer →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-cream-warm p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Publiés</p>
              <p className="mt-1 font-serif text-2xl text-forest">{publishedCount}</p>
            </div>
            <div className="rounded-lg bg-cream-warm p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-earth/60">Brouillons</p>
              <p className="mt-1 font-serif text-2xl text-forest">{draftCount}</p>
            </div>
          </div>
          <Link
            to="/admin/posts/$id"
            params={{ id: "new" }}
            className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft"
          >
            + Nouvel article
          </Link>
        </div>

        <div className="rounded-xl bg-card p-6 ring-1 ring-gold/15">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-forest">Messages reçus</h3>
            <Link to="/admin/messages" className="text-xs uppercase tracking-[0.15em] text-gold hover:text-forest">
              Ouvrir →
            </Link>
          </div>
          <p className="mt-6 font-serif text-4xl text-forest">{messagesCount}</p>
          <p className="text-xs text-earth/60">via le formulaire de contact</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-[color:var(--rose-soft)] to-cream p-6 ring-1 ring-gold/15">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[color:var(--rose-text)]" />
            <h3 className="font-serif text-xl text-[color:var(--rose-text)]">Gagnote solidaire</h3>
          </div>
          <p className="mt-5 font-serif text-3xl text-[color:var(--rose-text)]">1 245 €</p>
          <p className="text-xs text-earth/70">collectés ce mois-ci</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-earth/70">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+18% vs mois dernier</span>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
