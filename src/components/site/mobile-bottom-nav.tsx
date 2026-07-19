import { Link } from "@tanstack/react-router";
import { Calendar, Home, Sparkles, BookOpen, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CALENDLY_URL } from "../../lib/config";

/**
 * Mobile-only native-app-style bottom tab bar.
 * Hidden on lg+ screens (desktop keeps the classic header nav).
 */
export function MobileBottomNav() {
  const { t } = useTranslation();

  const tabs: ReadonlyArray<{ to: string; label: string; Icon: typeof Home; exact?: boolean }> = [
    { to: "/", label: t("nav.home"), Icon: Home, exact: true },
    { to: "/soins-et-therapies", label: t("nav.approches"), Icon: Sparkles },
    { to: "/blog", label: t("nav.blog"), Icon: BookOpen },
    { to: "/don", label: t("footer.donate"), Icon: Heart },
  ];

  return (
    <>
      {/* spacer so content never hides under the bar (incl. iOS safe area) */}
      <div
        aria-hidden="true"
        className="lg:hidden"
        style={{ height: "calc(4.75rem + env(safe-area-inset-bottom))" }}
      />

      <nav
        aria-label="Navigation mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-cream/95 backdrop-blur-lg shadow-[0_-8px_24px_-12px_rgba(30,58,43,0.25)] lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="relative mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-2 pb-1">
          {/* slot 1 + 2 */}
          {tabs.slice(0, 2).map(({ to, label, Icon, exact }) => (
            <TabLink key={to} to={to} label={label} Icon={Icon} exact={exact} />
          ))}

          {/* center floating CTA */}
          <div className="relative flex justify-center">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("cta.bookAppointment")}
              className="absolute -top-7 flex size-16 items-center justify-center rounded-full bg-gold text-forest shadow-lg shadow-gold/40 ring-4 ring-cream transition-transform active:scale-95"
            >
              <Calendar className="size-6" aria-hidden="true" />
              <span className="sr-only">{t("cta.bookAppointment")}</span>
            </a>
            <span className="mt-12 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-forest">
              {t("cta.bookNow")}
            </span>
          </div>

          {/* slot 4 + 5 */}
          {tabs.slice(2).map(({ to, label, Icon }) => (
            <TabLink key={to} to={to} label={label} Icon={Icon} />
          ))}
        </div>
      </nav>
    </>
  );
}

function TabLink({
  to,
  label,
  Icon,
  exact,
}: {
  to: string;
  label: string;
  Icon: typeof Home;
  exact?: boolean;
}) {
  return (
    <Link
      to={to as "/"}
      activeOptions={{ exact }}
      className="flex flex-col items-center gap-1 py-2 text-[0.62rem] font-medium uppercase tracking-[0.08em] text-earth/70 transition-colors"
      activeProps={{ className: "text-forest" }}
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex size-9 items-center justify-center rounded-full transition-all ${
              isActive ? "bg-forest text-cream" : "text-earth/70"
            }`}
          >
            <Icon className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="leading-none">{label}</span>
        </>
      )}
    </Link>
  );
}
