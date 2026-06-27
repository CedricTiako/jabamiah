import { Link } from "@tanstack/react-router";
import logoHorizontalLight from "../../assets/logo/jabamiah-horizontal-light.svg";
import logoHorizontalDark from "../../assets/logo/jabamiah-horizontal-dark.svg";
import logoIconLight from "../../assets/logo/jabamiah-icon-light.svg";
import logoIconDark from "../../assets/logo/jabamiah-icon-dark.svg";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  /** When true, render only the seed-of-life icon (no wordmark). */
  iconOnly?: boolean;
};

export function Logo({ variant = "light", className, iconOnly = false }: LogoProps) {
  const isDark = variant === "dark";
  const src = iconOnly
    ? isDark ? logoIconDark : logoIconLight
    : isDark ? logoHorizontalDark : logoHorizontalLight;

  return (
    <Link
      to="/"
      className={`inline-flex items-center ${className ?? ""}`}
      aria-label="Jabamiah — Médecine parallèle — Accueil"
    >
      <img
        src={src}
        alt="Jabamiah — Médecine parallèle"
        width={iconOnly ? 120 : 420}
        height={iconOnly ? 120 : 140}
        className={
          iconOnly
            ? "size-10 sm:size-11"
            : "h-10 w-auto sm:h-12 md:h-14"
        }
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}
