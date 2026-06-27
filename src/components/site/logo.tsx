import { Link } from "@tanstack/react-router";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function Logo({ variant = "light", className }: LogoProps) {
  const isDark = variant === "dark";
  return (
    <Link
      to="/"
      className={`flex items-center gap-3 ${className ?? ""}`}
      aria-label="Jabamiah — Accueil"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-11 shrink-0"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" stroke="var(--color-gold)" strokeWidth="1" opacity="0.6" />
        {/* tree trunk */}
        <path d="M24 38 V26" stroke="var(--color-gold)" strokeWidth="1.6" strokeLinecap="round" />
        {/* foliage circles forming a stylized tree */}
        <circle cx="24" cy="18" r="6" fill="var(--color-gold)" opacity="0.95" />
        <circle cx="17" cy="22" r="4" fill="var(--color-gold)" opacity="0.8" />
        <circle cx="31" cy="22" r="4" fill="var(--color-gold)" opacity="0.8" />
        <circle cx="20" cy="14" r="3" fill="var(--color-gold)" opacity="0.7" />
        <circle cx="28" cy="14" r="3" fill="var(--color-gold)" opacity="0.7" />
        {/* roots */}
        <path
          d="M19 40 Q24 36 29 40"
          stroke="var(--color-gold)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif text-2xl tracking-[0.22em] ${
            isDark ? "text-cream" : "text-forest"
          }`}
        >
          JABAMIAH
        </span>
        <span
          className={`mt-1 text-[0.6rem] tracking-[0.32em] ${
            isDark ? "text-cream/70" : "text-earth/60"
          }`}
        >
          MÉDECINE PARALLÈLE
        </span>
      </span>
    </Link>
  );
}
