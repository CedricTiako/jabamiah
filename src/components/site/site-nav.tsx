import { Link } from "@tanstack/react-router";
import { Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";

const CALENDLY_URL = "https://calendly.com/eirl-omont/60min";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const items = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/soins-et-therapies", label: t("nav.soins") },
    { to: "/plantes-et-remedes", label: t("nav.plantes") },
    { to: "/temoignages", label: t("nav.temoignages") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Logo />

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Navigation">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[0.78rem] uppercase tracking-[0.18em] text-earth/80 transition-colors hover:text-forest"
              activeProps={{ className: "text-forest font-medium border-b border-gold pb-1" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md border border-gold/40 bg-cream-warm/60 px-4 py-2.5 text-left transition-all hover:border-gold hover:bg-cream-warm"
          >
            <Calendar className="size-5 text-gold" aria-hidden="true" />
            <span className="flex flex-col leading-tight">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-forest">
                {t("nav.ctaTitle")}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-gold">
                {t("nav.ctaSub")}
              </span>
            </span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-gold/30 p-2 text-forest xl:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-gold/20 bg-cream xl:hidden" aria-label="Mobile">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            <div className="mb-2">
              <LanguageSwitcher />
            </div>
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
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
              className="mt-4 flex items-center justify-center gap-2 rounded-md bg-forest px-4 py-3 text-sm uppercase tracking-[0.15em] text-cream"
            >
              <Calendar className="size-4" aria-hidden="true" />
              {t("nav.ctaTitle")}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
