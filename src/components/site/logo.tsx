import { Link } from "@tanstack/react-router";
import logoLight from "../../assets/logo/jabamiah-horizontal-light.svg";
import logoDark from "../../assets/logo/jabamiah-horizontal-dark.svg";

type LogoProps = {
  variant?: "light" | "dark";
  className?: string;
  /** When true, hide the wordmark and only show the seed-of-life icon. */
  iconOnly?: boolean;
};

export function Logo({ variant = "light", className, iconOnly = false }: LogoProps) {
  const isDark = variant === "dark";
  const src = isDark ? logoDark : logoLight;
  return (
    <Link
      to="/"
      className={`inline-flex items-center ${className ?? ""}`}
      aria-label="Jabamiah — Médecine parallèle — Accueil"
    >
      <img
        src={src}
        alt="Jabamiah — Médecine parallèle"
        width={420}
        height={140}
        className={
          iconOnly
            ? "h-10 w-auto sm:h-11"
            : "h-10 w-auto sm:h-12 md:h-14"
        }
        style={iconOnly ? { objectFit: "contain", objectPosition: "left", clipPath: "inset(0 64% 0 0)" } : undefined}
      />
    </Link>
  );
}
