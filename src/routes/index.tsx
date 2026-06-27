import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Calendar,
  Compass,
  Ear,
  HeartHandshake,
  Leaf,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import heroImage from "../assets/hero-home.jpg";
import forestPath from "../assets/forest-path.jpg";
import approachEnergy from "../assets/approach-energy.jpg";
import approachMind from "../assets/approach-mind.jpg";
import approachPlants from "../assets/approach-plants.jpg";
import approachHarmony from "../assets/approach-harmony.jpg";
import approachSpirit from "../assets/approach-spirit.jpg";
import { LeafDivider } from "../components/site/leaf-divider";
import { buildSeoHead, SITE_URL } from "../lib/seo";
import { CALENDLY_URL, EMAIL, PHONE_HREF, WHATSAPP_HREF } from "../lib/config";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoHead({
      path: "/",
      title: "Jabamiah — Soins énergétiques & médecine parallèle",
      description:
        "Retrouvez l'équilibre du corps, de l'esprit et de l'âme. Consultations énergétiques 100% gratuites avec Jabamiah, à Forges-les-Eaux ou à distance.",
      image: `${SITE_URL}${heroImage}`,
    }),
  component: HomePage,
});

const VALUE_ICONS = [Leaf, Ear, Sparkles, Compass];
const APPROACH_ICONS = [Sparkles, Sun, Leaf, Compass, HeartHandshake];
const APPROACH_IMAGES = [approachEnergy, approachMind, approachPlants, approachHarmony, approachSpirit];

function HomePage() {
  return (
    <>
      <HeroSection />
      <ValuesStrip />
      <ApproachesSection />
      <GagnoteSection />
      <QuoteSection />
    </>
  );
}

function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Forêt lumineuse symbolisant l'harmonie et le soin énergétique" width={1920} height={1280} className="size-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-linear-to-r from-forest/95 via-forest/60 to-forest/30" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <span className="eyebrow text-gold">{t("home.heroEyebrow")}</span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-cream md:text-6xl lg:text-7xl">
            {t("home.heroTitle1")}
            <br /> {t("home.heroTitle2")}
            <br /> <em className="not-italic italic text-gold">{t("home.heroTitle3")}</em>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">{t("home.heroSubtitle")}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-md bg-gold px-7 py-4 text-sm uppercase tracking-[0.18em] text-forest shadow-lg shadow-gold/20 transition-all hover:bg-gold-soft"
            >
              <Calendar className="size-4" aria-hidden="true" />
              <span className="flex flex-col items-start leading-tight">
                <span className="font-semibold">{t("cta.bookAppointment")}</span>
                <span className="text-[0.65rem] tracking-[0.18em] text-forest/70">{t("cta.freeConsult")}</span>
              </span>
            </a>
            <a
              href="#mes-approches"
              className="inline-flex items-center gap-3 rounded-md border border-cream/30 bg-cream/5 px-6 py-4 text-sm uppercase tracking-[0.18em] text-cream backdrop-blur hover:bg-cream/15"
            >
              <ArrowRight className="size-4 text-gold" aria-hidden="true" />
              <span className="flex flex-col items-start leading-tight">
                <span>{t("home.heroDiscover")}</span>
                <span className="text-[0.65rem] tracking-[0.18em] text-cream/70">{t("home.heroMyApproaches")}</span>
              </span>
            </a>
          </div>

          <p className="mt-10 font-serif italic text-gold">
            {t("home.heroPeopleHelped")} <span aria-hidden="true">♡</span>
            <span className="ml-2 not-italic text-sm text-cream/60">{t("home.heroWithCare")}</span>
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl border border-gold/30 bg-forest-deep/80 p-7 backdrop-blur">
            <div className="flex items-center gap-3 text-cream">
              <Calendar className="size-5 text-gold" aria-hidden="true" />
              <h2 className="eyebrow text-cream">{t("home.heroBookEyebrow")}</h2>
            </div>
            <p className="mt-3 text-sm text-gold">{t("home.heroBookSub")}</p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-between rounded-md bg-linear-to-r from-gold to-gold-soft px-5 py-3.5 text-xs uppercase tracking-[0.18em] text-forest hover:opacity-95"
            >
              <span className="font-semibold">{t("cta.bookNow")}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <p className="mt-3 text-center text-xs text-cream/60">{t("home.heroPresentialOrRemote")}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-cream/10 pt-4 text-xs uppercase tracking-[0.15em] text-cream/70">
              <a href={PHONE_HREF} className="flex flex-col items-center gap-1 hover:text-gold">
                <Phone className="size-4 text-gold" aria-hidden="true" />
                {t("contact.phone")}
              </a>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:text-gold">
                <MessageCircle className="size-4 text-gold" aria-hidden="true" />
                {t("contact.whatsapp")}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex flex-col items-center gap-1 hover:text-gold">
                <Mail className="size-4 text-gold" aria-hidden="true" />
                {t("contact.email")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesStrip() {
  const { t } = useTranslation();
  const values = t("home.values", { returnObjects: true }) as Array<{ title: string; text: string }>;
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 gap-x-6 px-6 md:grid-cols-4">
        {values.map((value, idx) => {
          const Icon = VALUE_ICONS[idx] ?? Leaf;
          return (
            <div key={value.title} className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-cream-warm ring-1 ring-gold/30">
                <Icon className="size-7 text-gold" aria-hidden="true" />
              </div>
              <h3 className="eyebrow mt-5 text-forest">{value.title}</h3>
              <p className="mt-2 max-w-[18ch] text-xs leading-relaxed text-earth/70">{value.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ApproachesSection() {
  const { t } = useTranslation();
  const approaches = t("home.approaches", { returnObjects: true }) as Array<{ title: string; text: string }>;
  return (
    <section id="mes-approches" className="bg-cream pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="eyebrow text-gold">{t("home.approachesEyebrow")}</span>
          <h2 className="mt-4 font-serif text-4xl text-forest md:text-5xl">{t("home.approachesTitle1")}</h2>
          <p className="mt-2 font-serif text-2xl italic text-earth/80">{t("home.approachesTitle2")}</p>
          <LeafDivider className="mt-6" />
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {approaches.map((item, idx) => {
            const Icon = APPROACH_ICONS[idx] ?? Sparkles;
            const image = APPROACH_IMAGES[idx] ?? approachEnergy;
            return (
              <article key={item.title} className="group flex flex-col overflow-hidden rounded-lg bg-card ring-1 ring-gold/20 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-forest/10">
                <div className="relative aspect-square overflow-hidden">
                  <img src={image} alt={item.title} width={800} height={800} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-x-0 -bottom-7 flex justify-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-cream ring-1 ring-gold/40">
                      <Icon className="size-6 text-gold" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-6 pb-7 pt-12 text-center">
                  <h3 className="eyebrow text-forest">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-earth/75">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GagnoteSection() {
  const { t } = useTranslation();
  return (
    <section className="bg-cream-warm py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <LeafDivider className="mb-8" />
        <span className="eyebrow text-rose-text">{t("home.gagnoteEyebrow")}</span>
        <h2 className="mt-4 font-serif text-3xl text-forest md:text-4xl">
          {t("home.gagnoteTitle")} <Users className="ml-2 inline size-6 text-gold" aria-hidden="true" />
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-earth/85 md:text-base">{t("home.gagnoteP1")}</p>
        <p className="mt-4 text-sm leading-relaxed text-earth/85 md:text-base">{t("home.gagnoteP2")}</p>
        <a href="/about" className="mt-8 inline-flex items-center gap-2 rounded-md border border-gold/30 bg-cream px-6 py-3 text-xs uppercase tracking-[0.18em] text-forest hover:border-gold hover:bg-cream-warm/60">
          {t("home.gagnoteCta")} <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}

function QuoteSection() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden py-24">
      <img src={forestPath} alt="" width={1920} height={900} loading="lazy" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-b from-forest/60 via-forest/40 to-forest/70" />
      <div className="relative mx-auto max-w-4xl px-6 text-center text-cream">
        <p className="font-serif text-2xl italic leading-relaxed md:text-3xl">{t("home.quote")}</p>
        <LeafDivider className="mt-6 text-gold" />
      </div>
    </section>
  );
}
