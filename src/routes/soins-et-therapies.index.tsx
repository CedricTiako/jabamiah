import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, HeartHandshake, Leaf, Sparkles, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { THERAPIES, localized, type Therapy } from "../content/therapies";
import { LeafDivider } from "../components/site/leaf-divider";
import heroImage from "../assets/hero-home.jpg";

const CALENDLY_URL = "https://calendly.com/eirl-omont/60min";

const ICONS = {
  sparkles: Sparkles,
  sun: Sun,
  leaf: Leaf,
  compass: Compass,
  "heart-handshake": HeartHandshake,
} as const;

export const Route = createFileRoute("/soins-et-therapies/")({
  head: () => ({
    meta: [
      { title: "Soins & Thérapies — Jabamiah" },
      {
        name: "description",
        content:
          "Soins énergétiques, guérison par la pensée, plantes médicinales, harmonisation et développement spirituel.",
      },
    ],
  }),
  component: TherapiesIndex,
});

function TherapiesIndex() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage ?? "fr").slice(0, 2);

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="size-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/70 to-forest/40" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="eyebrow text-gold">{t("therapiesPage.eyebrow")}</span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
            {t("therapiesPage.title1")}
            <br />
            <em className="not-italic italic text-gold">{t("therapiesPage.title2")}</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-cream/85">
            {t("therapiesPage.subtitle")}
          </p>
          <LeafDivider className="mt-8 text-gold" />
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {THERAPIES.map((therapy) => (
              <TherapyCard key={therapy.slug} therapy={therapy} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-warm py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-serif text-4xl text-forest md:text-5xl">
            {t("therapiesPage.stepsTitle")}
          </h2>
          <LeafDivider className="mt-5" />

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {(t("therapiesPage.steps", { returnObjects: true }) as Array<{ title: string; text: string }>).map(
              (step, idx) => (
                <div key={idx} className="relative rounded-2xl bg-cream p-8 text-left ring-1 ring-gold/20">
                  <span className="absolute -top-5 left-8 flex size-12 items-center justify-center rounded-full bg-forest font-serif text-xl text-gold ring-1 ring-gold/40">
                    {idx + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl text-forest">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-earth/75">{step.text}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-serif text-2xl italic text-earth/85 md:text-3xl">
            « Le bien que tu fais aujourd'hui, revient toujours à ton âme. »
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-md bg-forest px-7 py-4 text-sm uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
          >
            {t("therapiesPage.bookCta")}
            <ArrowRight className="size-4 text-gold" />
          </a>
        </div>
      </section>
    </>
  );
}

function TherapyCard({ therapy, locale }: { therapy: Therapy; locale: string }) {
  const Icon = ICONS[therapy.iconName];
  const { t } = useTranslation();
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg bg-card ring-1 ring-gold/20 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-forest/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={therapy.image}
          alt={localized(therapy.title, locale)}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 -bottom-7 flex justify-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-cream ring-1 ring-gold/40">
            <Icon className="size-6 text-gold" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-7 pt-12 text-center">
        <h3 className="eyebrow text-forest">{localized(therapy.title, locale)}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-earth/75">
          {localized(therapy.short, locale)}
        </p>
        <Link
          to="/soins-et-therapies/$slug"
          params={{ slug: therapy.slug }}
          className="mt-5 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] text-gold hover:text-forest"
        >
          {t("cta.learnMore")}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}
