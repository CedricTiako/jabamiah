import { Link } from "@tanstack/react-router";
import {
  Calendar,
  Facebook,
  HeartHandshake,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "./logo";

const PHONE = "07 45 15 54 51";
const PHONE_HREF = "tel:+33745155451";
const WHATSAPP_HREF = "https://wa.me/33745155451";
const EMAIL = "contact@jabamiah.eu";

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="relative bg-forest text-cream">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="dark" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/70">{t("footer.tagline")}</p>
        </div>

        <div className="lg:col-span-2">
          <h3 className="eyebrow mb-5 text-gold">{t("footer.consultations")}</h3>
          <a
            href="https://calendly.com/eirl-omont/60min"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 text-sm text-cream/90 transition-colors hover:text-gold"
          >
            <Calendar className="mt-0.5 size-4 text-gold" aria-hidden="true" />
            <span>
              {t("footer.free")}
              <span className="block text-xs text-cream/60">{t("footer.byAppt")}</span>
            </span>
          </a>
        </div>

        <div className="lg:col-span-3">
          <h3 className="eyebrow mb-5 text-gold">{t("footer.contactRapide")}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 size-4 text-gold" aria-hidden="true" />
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="text-cream/90 hover:text-gold">
                WhatsApp
                <span className="block text-xs text-cream/60">{t("footer.whatsappSub")}</span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 text-gold" aria-hidden="true" />
              <a href={PHONE_HREF} className="text-cream/90 hover:text-gold">
                {t("nav.contact")}
                <span className="block text-xs text-cream/60">{PHONE}</span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-gold" aria-hidden="true" />
              <a href={`mailto:${EMAIL}`} className="text-cream/90 hover:text-gold">
                Email
                <span className="block text-xs text-cream/60">{EMAIL}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="eyebrow mb-5 text-gold">{t("footer.engagement")}</h3>
          <p className="flex items-start gap-3 text-sm text-cream/90">
            <HeartHandshake className="mt-0.5 size-4 text-gold" aria-hidden="true" />
            <span>{t("footer.engagementText")}</span>
          </p>

          <h3 className="eyebrow mt-8 mb-4 text-gold">{t("footer.follow")}</h3>
          <div className="flex items-center gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                aria-label={Icon.displayName ?? "social"}
                className="rounded-full border border-gold/30 p-2 text-gold hover:bg-gold hover:text-forest"
              >
                <Icon className="size-4" />
              </a>
            ))}
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full border border-gold/30 p-2 text-gold hover:bg-gold hover:text-forest"
            >
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60 md:flex-row">
          <p>© {new Date().getFullYear()} Jabamiah — {t("footer.copyright")}</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/mentions-legales" className="hover:text-gold">{t("footer.legal")}</Link>
            <Link to="/politique-de-confidentialite" className="hover:text-gold">{t("footer.privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
