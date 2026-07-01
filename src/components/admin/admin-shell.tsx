import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
} from "lucide-react";
import { Logo } from "../site/logo";

type Item = { to: string; label: string; icon: typeof LayoutDashboard };

const items: Item[] = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/consultations", label: "Consultations", icon: Sparkles },
  { to: "/admin/suivi", label: "Suivi & Évolution", icon: LineChart },
  { to: "/admin/bilan", label: "Bilan énergétique", icon: Activity },
  { to: "/admin/protocoles", label: "Protocoles", icon: Layers },
  { to: "/admin/documents", label: "Documents", icon: FolderClosed },
  { to: "/admin/paiements", label: "Paiements", icon: CreditCard },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  { to: "/admin/contenu", label: "Contenu (Blog)", icon: FileText },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
];

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
      <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-gold/15 bg-cream-warm/60 lg:flex">
        <div className="flex flex-col items-center border-b border-gold/15 px-6 py-8">
          <Logo variant="light" className="!h-24" />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {items.map((it) => {
            const active = isActive(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition ${
                  active
                    ? "bg-forest text-cream shadow-sm"
                    : "text-earth/80 hover:bg-cream hover:text-forest"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gold/15 p-4">
          <Link
            to="/admin/aide"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-earth/80 hover:bg-cream hover:text-forest"
          >
            <HelpCircle className="h-4 w-4" /> Aide & support
          </Link>
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-cream px-3 py-2.5 ring-1 ring-gold/20">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-forest text-sm font-medium text-cream">
              LO
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-forest">Loïc Omont</p>
              <p className="text-xs text-earth/60">Thérapeute</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gold/15 bg-cream/95 px-6 py-5 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            {backTo ? (
              <Link
                to={backTo.to}
                className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-forest hover:bg-cream-warm"
                aria-label={backTo.label}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : null}
            <div className="min-w-0">
              <h1 className="truncate font-serif text-2xl text-forest md:text-3xl">{title}</h1>
              {subtitle ? <p className="mt-0.5 truncate text-sm text-earth/70">{subtitle}</p> : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-forest hover:bg-cream-warm"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--rose-text)] text-[10px] font-medium text-cream">
                3
              </span>
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="hidden items-center gap-2 rounded-md bg-forest px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-forest-soft md:inline-flex"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </header>

        {/* Mobile top-tab menu */}
        <nav className="flex gap-2 overflow-x-auto border-b border-gold/10 bg-cream px-4 py-2 lg:hidden">
          {items.map((it) => {
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

        <div className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
