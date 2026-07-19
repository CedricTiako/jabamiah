import { Link } from "@tanstack/react-router";
import { Calendar, ChevronDown, Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { CALENDLY_URL } from "../../lib/config";

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [approachesOpen, setApproachesOpen] = useState(false);
  const [mobileApproachesOpen, setMobileApproachesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useTranslation();

  const simpleItems = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/temoignages", label: t("nav.temoignages") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  const approachItems = [
    { to: "/soins-et-therapies", label: t("nav.soins") },
    { to: "/plantes-et-remedes", label: t("nav.plantes") },
  ] as const;

  function handleApproachesEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setApproachesOpen(true);
  }

  function handleApproachesLeave() {
    closeTimer.current = setTimeout(() => setApproachesOpen(false), 120);
  }

  const linkBase =
    "text-[0.78rem] uppercase tracking-[0.18em] text-earth/80 transition-colors hover:text-forest";
  const activeLink =
    "text-forest font-semibold relative after:absolute after:inset-x-0 after:-bottom-[19px] after:h-0.5 after:bg-gold";

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {/* Accueil & À propos */}
          {simpleItems.slice(0, 2).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={linkBase}
              activeProps={{ className: activeLink }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}

          {/* Approches dropdown */}
          <div
            className="relative"
            onMouseEnter={handleApproachesEnter}
            onMouseLeave={handleApproachesLeave}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={approachesOpen ? "true" : "false"}
              className={`${linkBase} flex items-center gap-1`}
            >
              {t("nav.approches")}
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${approachesOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {approachesOpen && (
              <div
                className="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 overflow-hidden rounded-lg border border-gold/20 bg-cream shadow-lg shadow-forest/10"
                onMouseEnter={handleApproachesEnter}
                onMouseLeave={handleApproachesLeave}
              >
                {approachItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setApproachesOpen(false)}
                    className="flex items-center gap-3 border-b border-gold/10 px-5 py-3 text-[0.78rem] uppercase tracking-[0.18em] text-earth/80 transition-colors last:border-0 hover:bg-cream-warm hover:text-forest"
                    activeProps={{ className: "text-forest font-semibold bg-cream-warm" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Autres liens simples */}
          {simpleItems.slice(2).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={linkBase}
              activeProps={{ className: activeLink }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md bg-gold px-4 py-2.5 text-left transition-all hover:bg-gold-soft"
          >
            <Calendar className="size-5 text-forest" aria-hidden="true" />
            <span className="flex flex-col leading-tight">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-forest">
                {t("nav.ctaTitle")}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-forest/70">
                {t("nav.ctaSub")}
              </span>
            </span>
          </a>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md border border-gold/30 p-2 text-forest lg:hidden"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen ? "true" : "false"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-gold/20 bg-cream lg:hidden" aria-label="Navigation mobile">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            <div className="mb-2">
              <LanguageSwitcher />
            </div>

            {simpleItems.slice(0, 2).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="border-b border-gold/10 py-3 text-sm uppercase tracking-[0.15em] text-earth/80"
                activeProps={{ className: "text-forest font-medium" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}

            {/* Approches mobile accordéon */}
            <div className="border-b border-gold/10">
              <button
                type="button"
                onClick={() => setMobileApproachesOpen((v) => !v)}
                className="flex w-full items-center justify-between py-3 text-sm uppercase tracking-[0.15em] text-earth/80"
              >
                {t("nav.approches")}
                <ChevronDown
                  className={`size-4 transition-transform duration-200 ${mobileApproachesOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {mobileApproachesOpen && (
                <div className="mb-2 space-y-1 pl-4">
                  {approachItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileApproachesOpen(false);
                      }}
                      className="block border-b border-gold/10 py-2.5 text-sm uppercase tracking-[0.15em] text-earth/70"
                      activeProps={{ className: "text-forest font-medium" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {simpleItems.slice(2).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="border-b border-gold/10 py-3 text-sm uppercase tracking-[0.15em] text-earth/80"
                activeProps={{ className: "text-forest font-medium" }}
              >
                {item.label}
              </Link>
            ))}

            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-3 text-sm uppercase tracking-[0.15em] text-forest hover:bg-gold-soft"
            >
              <Calendar className="size-4" aria-hidden="true" />
              {t("nav.ctaTitle")}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
