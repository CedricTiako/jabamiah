import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminGetNotificationSummary } from "../../lib/notifications.functions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Sparkles,
  LineChart,
  Activity,
  Layers,
  FolderClosed,
  CreditCard,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  ChevronLeft,
  Search,
  Star,
} from "lucide-react";
import { Logo } from "../site/logo";

type Item = { to: string; label: string; icon: typeof LayoutDashboard };
type Group = { label: string; items: Item[] };

const groups: Group[] = [
  {
    label: "Vue d'ensemble",
    items: [{ to: "/admin", label: "Tableau de bord", icon: LayoutDashboard }],
  },
  {
    label: "Activité",
    items: [
      { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
      { to: "/admin/clients", label: "Clients", icon: Users },
      { to: "/admin/consultations", label: "Consultations", icon: Sparkles },
      { to: "/admin/messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    label: "Métier",
    items: [
      { to: "/admin/suivi", label: "Suivi & Évolution", icon: LineChart },
      { to: "/admin/bilan", label: "Bilan énergétique", icon: Activity },
      { to: "/admin/protocoles", label: "Protocoles", icon: Layers },
      { to: "/admin/documents", label: "Documents", icon: FolderClosed },
    ],
  },
  {
    label: "Gestion",
    items: [
      { to: "/admin/paiements", label: "Paiements", icon: CreditCard },
      { to: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
    ],
  },
  {
    label: "Publication",
    items: [
      { to: "/admin/contenu", label: "Contenu (Blog)", icon: FileText },
      { to: "/admin/avis", label: "Avis clients", icon: Star },
      { to: "/admin/parametres", label: "Paramètres", icon: Settings },
    ],
  },
];

const flatItems: Item[] = groups.flatMap((g) => g.items);

type Props = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  onSignOut?: () => void;
  backTo?: { to: string; label: string };
};

export function AdminShell({ title, subtitle, actions, children, onSignOut, backTo }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/admin" ? pathname === "/admin" : pathname.startsWith(to));

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-gold/15 bg-cream-warm/40 lg:flex">
        <div className="flex flex-col items-center border-b border-gold/15 px-6 py-8">
          <Logo variant="light" className="!h-20" />
          <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-earth/50">Espace praticien</p>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.22em] text-earth/45">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((it) => {
                  const active = isActive(it.to);
                  const Icon = it.icon;
                  return (
                    <Link
                      key={it.to}
                      to={it.to}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-forest text-cream shadow-sm"
                          : "text-earth/75 hover:bg-cream hover:text-forest"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
                      )}
                      <Icon className={`h-4 w-4 ${active ? "text-gold" : "text-earth/50 group-hover:text-forest"}`} />
                      <span>{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-gold/15 p-4">
          <Link
            to="/admin/aide"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-earth/70 hover:bg-cream hover:text-forest"
          >
            <HelpCircle className="h-4 w-4 text-earth/50" /> Aide & support
          </Link>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-cream px-3 py-2.5 ring-1 ring-gold/25">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-forest font-serif text-sm text-cream">
              LO
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-forest">Loïc Omont</p>
              <p className="text-xs text-earth/60">Thérapeute</p>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="grid h-8 w-8 place-items-center rounded-full text-earth/60 hover:bg-cream-warm hover:text-forest"
              aria-label="Se déconnecter"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-gold/15 bg-cream/85 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-5 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              {backTo ? (
                <Link
                  to={backTo.to}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/30 text-forest hover:bg-cream-warm"
                  aria-label={backTo.label}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              ) : null}
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-earth/50">Jabamiah · Admin</p>
                <h1 className="mt-0.5 truncate font-serif text-2xl leading-tight text-forest md:text-3xl">
                  {title}
                </h1>
                {subtitle ? <p className="mt-0.5 truncate text-sm text-earth/65">{subtitle}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-earth/40" />
                <input
                  type="search"
                  placeholder="Rechercher…"
                  className="w-56 rounded-full border border-gold/25 bg-cream-warm/60 py-2 pl-9 pr-3 text-xs text-earth placeholder:text-earth/40 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              {actions}
              <NotificationsBell />
            </div>
          </div>
        </header>

        {/* Mobile top-tab menu */}
        <nav className="flex gap-2 overflow-x-auto border-b border-gold/10 bg-cream px-4 py-2 lg:hidden">
          {flatItems.map((it) => {
            const active = isActive(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
                  active ? "bg-forest text-cream" : "bg-cream-warm text-earth/80"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-10">{children}</div>
      </div>
    </div>
  );
}

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const getSummary = useServerFn(adminGetNotificationSummary);
  const { data } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: () => getSummary(),
    refetchInterval: 60_000,
  });

  const unreadMessages = data?.unreadMessages ?? 0;
  const pendingReviews = data?.pendingReviews ?? 0;
  const total = unreadMessages + pendingReviews;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-forest hover:bg-cream-warm"
          aria-label={total > 0 ? `Notifications (${total} nouvelles)` : "Notifications"}
        >
          <Bell className="h-4 w-4" />
          {total > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-rose-text px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-cream">
              {total > 9 ? "9+" : total}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 bg-cream p-0">
        <div className="border-b border-gold/15 px-4 py-3">
          <p className="font-serif text-sm text-forest">Notifications</p>
        </div>
        {total === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-earth/60">Rien de nouveau pour le moment.</p>
        ) : (
          <div className="divide-y divide-gold/10">
            {unreadMessages > 0 && (
              <Link
                to="/admin/messages"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-cream-warm/50"
              >
                <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-forest">
                    {unreadMessages} nouveau{unreadMessages > 1 ? "x" : ""} message{unreadMessages > 1 ? "s" : ""}
                  </p>
                  <p className="truncate text-xs text-earth/60">
                    {data?.recentMessages.map((m) => m.name).join(", ")}
                  </p>
                </div>
              </Link>
            )}
            {pendingReviews > 0 && (
              <Link
                to="/admin/avis"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-cream-warm/50"
              >
                <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-forest">
                    {pendingReviews} avis à modérer
                  </p>
                  <p className="truncate text-xs text-earth/60">
                    {data?.recentReviews.map((r) => r.author_name).join(", ")}
                  </p>
                </div>
              </Link>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
