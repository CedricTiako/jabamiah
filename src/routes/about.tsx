import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Calendar, Compass, Heart, Leaf, Lock, Sparkles, Sun } from "lucide-react";
import heroAbout from "../assets/hero-about.jpg";
import forestPath from "../assets/forest-path.jpg";
import { LeafDivider } from "../components/site/leaf-divider";
import { buildSeoHead, SITE_URL } from "../lib/seo";

const CALENDLY_URL = "https://calendly.com/eirl-omont/60min";

export const Route = createFileRoute("/about")({
  head: () =>
    buildSeoHead({
      path: "/about",
      title: "À propos — Jabamiah, un chemin de cœur au service de l'humain",
      description:
        "Découvrez Jabamiah, medium et thérapeute holistique animé par l'amour et le besoin d'aider. Consultations énergétiques gratuites sur rendez-vous.",
      image: `${SITE_URL}${heroAbout}`,
    }),
  component: AboutPage,
});

const VALUE_ICONS = [Heart, Leaf, Sparkles];
const PILLAR_ICONS = [Heart, Sparkles, Leaf, Compass, Sun];

function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhySection />
      <PillarsSection />
      <ConsultationCTA />
      <QuoteSection />
    </>
  );
}

function AboutHero() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <div className="absolute inset-0">
        <img src={heroAbout} alt="" width={1920} height={1280} className="size-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/55 to-forest/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <span className="eyebrow text-gold">{t("about.heroEyebrow")}</span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
            {t("about.heroTitle1")}
            <br /> <em className="not-italic italic text-gold">{t("about.heroTitle2")}</em>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/85 md:text-lg">{t("about.heroP1")}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/80">{t("about.heroP2")}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-md border border-gold/30 bg-forest-deep/70 px-5 py-4 backdrop-blur">
              <Heart className="size-5 text-gold" aria-hidden="true" />
              <div className="text-xs uppercase tracking-[0.15em] text-cream/85">
                {t("about.badgeFreeTitle")}
                <span className="block text-gold">{t("about.badgeFreeSub")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-gold/30 bg-forest-deep/70 px-5 py-4 backdrop-blur">
              <Calendar className="size-5 text-gold" aria-hidden="true" />
              <div className="text-xs uppercase tracking-[0.15em] text-cream/85">
                {t("about.badgeRdv")}
                <span className="block text-cream/70 normal-case tracking-normal">{t("about.badgeRdvSub")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const { t } = useTranslation();
  const values = t("about.values", { returnObjects: true }) as Array<{ title: string; text: string }>;
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="font-serif text-4xl text-forest md:text-5xl">{t("about.whyTitle")}</h2>
          <LeafDivider className="mt-5" />
          <p className="mt-6 font-serif text-xl italic text-earth/80">{t("about.whyIntro")}</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="space-y-5 text-sm leading-relaxed text-earth/85 lg:col-span-4">
            <p>{t("about.whyP1")}</p>
            <p>{t("about.whyP2")}</p>
            <p>{t("about.whyP3")}</p>
          </div>

          <ul className="space-y-5 lg:col-span-4">
            {values.map((value, idx) => {
              const Icon = VALUE_ICONS[idx] ?? Heart;
              return (
                <li key={value.title} className="flex items-start gap-4">
                  <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-cream-warm ring-1 ring-gold/30">
                    <Icon className="size-4 text-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-forest">{value.title}</h3>
                    <p className="mt-1 text-sm text-earth/75">{value.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="relative overflow-hidden rounded-2xl lg:col-span-4">
            <img src={forestPath} alt="" width={800} height={1000} loading="lazy" className="size-full object-cover" />
            <div className="absolute inset-0 bg-forest/60" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <blockquote className="text-center font-serif text-base italic leading-relaxed text-cream md:text-lg">
                {t("about.quote")}
                <LeafDivider className="mt-4 text-gold" />
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PillarsSection() {
  const { t } = useTranslation();
  const pillars = t("about.pillars", { returnObjects: true }) as Array<{ title: string; text: string }>;
  return (
    <section className="bg-cream-warm py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="font-serif text-4xl text-forest md:text-5xl">{t("about.pillarsTitle")}</h2>
          <p className="mt-3 text-sm text-earth/75">{t("about.pillarsSubtitle")}</p>
          <LeafDivider className="mt-5" />
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar, idx) => {
            const Icon = PILLAR_ICONS[idx] ?? Heart;
            return (
              <div key={pillar.title} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-cream ring-1 ring-gold/30">
                  <Icon className="size-6 text-gold" aria-hidden="true" />
                </div>
                <h3 className="eyebrow mt-5 text-forest">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-earth/75">{pillar.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ConsultationCTA() {
  const { t } = useTranslation();
  const mini = [
    { ...(t("about.miniFree", { returnObjects: true }) as { title: string; text: string }), Icon: Heart },
    { ...(t("about.miniListening", { returnObjects: true }) as { title: string; text: string }), Icon: Calendar },
    { ...(t("about.miniConfidential", { returnObjects: true }) as { title: string; text: string }), Icon: Lock },
  ];
  return (
    <section className="bg-cream pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl bg-forest p-10 text-cream lg:p-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="flex items-center gap-5 lg:col-span-6">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-gold/40">
                <Calendar className="size-7 text-gold" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-cream md:text-3xl">{t("about.ctaTitle")}</h2>
                <p className="mt-2 text-sm text-cream/80">{t("about.ctaSub")}</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 lg:col-span-6 lg:items-end">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-gold px-8 py-4 text-sm uppercase tracking-[0.18em] text-forest shadow-md hover:bg-gold-soft">
                {t("about.ctaButton")}
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-6 border-t border-cream/15 pt-8 sm:grid-cols-3 text-xs">
            {mini.map(({ title, text, Icon }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
                <div>
                  <p className="uppercase tracking-[0.18em] text-cream">{title}</p>
                  <p className="mt-1 text-cream/70">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden py-24">
      <img src={forestPath} alt="" width={1920} height={900} loading="lazy" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/40 to-forest/70" />
      <div className="relative mx-auto max-w-4xl px-6 text-center text-cream">
        <p className="font-serif text-2xl italic leading-relaxed md:text-3xl">{t("about.quote")}</p>
        <LeafDivider className="mt-6 text-gold" />
      </div>
    </section>
  );
}
