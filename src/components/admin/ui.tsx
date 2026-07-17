import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            to={action.to as any}
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

function parseLocalDate(value: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatLocalDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
};

// A Popover + Calendar picker rather than a native <input type="date">: inside the
// admin drawers (built on vaul, a Radix Dialog wrapper) the browser's native date
// picker gets its focus stolen back by the drawer's focus trap the instant it opens,
// so it never actually shows. Popover is a Radix primitive too, so it coordinates
// with the drawer's focus/dismiss layers instead of fighting them.
export function DateField({ label, value, onChange, required, className = "" }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = parseLocalDate(value);

  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-[0.15em] text-forest">
        {label}
        {required ? " *" : ""}
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="mt-1 flex w-full items-center justify-between gap-2 rounded-md border border-gold/30 bg-card px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <span className={selected ? "" : "text-earth/40"}>
              {selected ? selected.toLocaleDateString("fr-FR") : "Sélectionner une date…"}
            </span>
            <CalendarIcon className="h-4 w-4 shrink-0 text-earth/50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => {
              if (date) onChange(formatLocalDate(date));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </label>
  );
}
