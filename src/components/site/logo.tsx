import { Link } from "@tanstack/react-router";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
};

export function Logo({ variant = "light", className }: LogoProps) {
  const isDark = variant === "dark";
  const mark = isDark ? "var(--color-cream)" : "var(--color-forest)";
  return (
    <Link
      to="/"
      className={`flex items-center gap-3 ${className ?? ""}`}
      aria-label="Jabamiah — Médecine parallèle — Accueil"
    >
      <svg
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className="size-12 shrink-0"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="56" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M60,55 C52,45 50,28 60,15 C70,28 68,45 60,55 Z"
            fill={mark}
            transform={`rotate(${deg} 60 55)`}
          />
        ))}
        <circle cx="60" cy="55" r="3.5" fill="var(--color-gold)" />
        <path d="M57,95 C58,85 59,70 60,58 C61,70 62,85 63,95 Z" fill={mark} />
        <path
          d="M58,94 C50,96 44,99 38,104"
          fill="none"
          stroke={mark}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M62,94 C70,96 76,99 82,104"
          fill="none"
          stroke={mark}
          strokeWidth="2"
          strokeLinecap="round"
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
        <span className="mt-1.5 text-[0.6rem] tracking-[0.32em] text-gold">
          MÉDECINE PARALLÈLE
        </span>
      </span>
    </Link>
  );
}
