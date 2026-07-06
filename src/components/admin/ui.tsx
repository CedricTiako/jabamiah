import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

/**
 * Reusable admin primitives for the redesigned dashboard.
 * Keep visuals consistent across all admin pages.
 */

type KpiCardProps = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
};

export function KpiCard({ label, value, delta, trend = "neutral", icon: Icon }: KpiCardProps) {
  const trendClass =
    trend === "up"
      ? "text-forest"
      : trend === "down"
        ? "text-[color:var(--rose-text)]"
        : "text-earth/55";

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-5 ring-1 ring-gold/15 transition hover:ring-gold/35">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/5 blur-2xl transition group-hover:bg-gold/10" />
      <div className="relative flex items-start justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-earth/55">{label}</p>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest/8 text-forest">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="relative mt-4 font-serif text-4xl leading-none text-forest">{value}</p>
      {delta ? <p className={`relative mt-2 text-xs ${trendClass}`}>{delta}</p> : null}
    </div>
  );
}

type SectionCardProps = {
  title: string;
  eyebrow?: string;
  action?: { to: string; label: string; params?: Record<string, string> };
  children: ReactNode;
  className?: string;
};

export function SectionCard({ title, eyebrow, action, children, className = "" }: SectionCardProps) {
  return (
    <section className={`rounded-2xl bg-card p-6 ring-1 ring-gold/15 ${className}`}>
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-earth/50">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-1 font-serif text-xl leading-tight text-forest">{title}</h3>
        </div>
        {action ? (
          <Link
            to={action.to}
            params={action.params as never}
            className="inline-flex shrink-0 items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-gold hover:text-forest"
          >
            {action.label}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "green" | "gold" | "rose" | "neutral";
  children: ReactNode;
}) {
  const map: Record<string, string> = {
    green: "bg-forest/10 text-forest",
    gold: "bg-[color:var(--gold-soft)]/60 text-[color:var(--earth)]",
    rose: "bg-[color:var(--rose-soft)] text-[color:var(--rose-text)]",
    neutral: "bg-earth/8 text-earth/70",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] ${map[tone]}`}>
      {children}
    </span>
  );
}
