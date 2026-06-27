import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Jabamiah" },
      {
        name: "description",
        content:
          "Contactez Jabamiah pour une consultation énergétique gratuite : WhatsApp, téléphone, email ou prise de rendez-vous en ligne.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="eyebrow text-gold">Contact</span>
          <h1 className="mt-4 font-serif text-4xl text-forest md:text-5xl">Échangeons ensemble</h1>
          <p className="mt-4 mx-auto max-w-xl text-sm text-earth/75">
            Choisissez le moyen qui vous convient le mieux. Je vous réponds avec attention et
            bienveillance.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            icon={MessageCircle}
            label="WhatsApp"
            value="Message direct"
            href="https://wa.me/33745155451"
          />
          <ContactCard
            icon={Phone}
            label="Téléphone"
            value="07 45 15 54 51"
            href="tel:+33745155451"
          />
          <ContactCard
            icon={Mail}
            label="Email"
            value="contact@jabamiah.eu"
            href="mailto:contact@jabamiah.eu"
          />
          <ContactCard
            icon={MapPin}
            label="Localisation"
            value="Forges-les-Eaux 76440"
          />
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-gold/20">
          <iframe
            src="https://calendly.com/eirl-omont/60min?embed_domain=jabamiah.eu&embed_type=Inline&hide_gdpr_banner=1&background_color=f5f0e6&text_color=2c3a24&primary_color=c4a661"
            width="100%"
            height="780"
            frameBorder="0"
            title="Prendre rendez-vous"
          />
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <Icon className="size-6 text-gold" aria-hidden="true" />
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-forest">{label}</p>
      <p className="mt-2 text-sm text-earth/80">{value}</p>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="flex flex-col items-center rounded-xl bg-cream-warm p-6 text-center ring-1 ring-gold/20 transition-all hover:-translate-y-0.5 hover:ring-gold"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="flex flex-col items-center rounded-xl bg-cream-warm p-6 text-center ring-1 ring-gold/20">
      {inner}
    </div>
  );
}
