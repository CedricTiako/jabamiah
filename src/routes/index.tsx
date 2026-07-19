import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Calendar,
  Compass,
  Ear,
  Heart,
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { buildSeoHead, SITE_URL } from "../lib/seo";
import { CALENDLY_URL, EMAIL, PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "../lib/config";
import { getServerLocale } from "../lib/locale-server";
import { tServer } from "../lib/t-server";

export const Route = createFileRoute("/")({
  loader: async () => ({ locale: await getServerLocale() }),
  head: ({ loaderData }) => {
    const loc = loaderData?.locale ?? "fr";
    const head = buildSeoHead({
      path: "/",
      title: tServer(loc, "seo.home.title"),
      description: tServer(loc, "seo.home.description"),
      image: `${SITE_URL}${heroImage}`,
    });
    return {
      ...head,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Les consultations sont-elles vraiment gratuites ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Oui, absolument. Jabamiah n'a jamais voulu faire payer ses soins. L'aide doit rester accessible à toutes et tous, sans condition.",
                },
              },
              {
                "@type": "Question",
                name: "Comment prendre rendez-vous avec Jabamiah ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Vous pouvez réserver directement en ligne via Calendly, ou contacter Jabamiah par WhatsApp, téléphone ou email.",
                },
              },
              {
                "@type": "Question",
                name: "Les séances avec Jabamiah sont-elles disponibles à distance ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Oui. Jabamiah propose des consultations en présentiel à Forges-les-Eaux (Normandie) et entièrement à distance, par téléphone ou visioconférence.",
                },
              },
              {
                "@type": "Question",
                name: "Combien de temps dure une séance avec Jabamiah ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Une séance dure en général entre 45 minutes et 1 heure, selon votre demande et vos besoins.",
                },
              },
            ],
          }),
        },
      ],
    };
  },
  component: HomePage,
});

const VALUE_ICONS = [Leaf, Ear, Sparkles, Compass];
const APPROACH_ICONS = [Sparkles, Sun, Leaf, Compass, HeartHandshake];
const APPROACH_IMAGES = [approachEnergy, approachMind, approachPlants, approachHarmony, approachSpirit];

function HomePage() {
  return (
    <>
      <HeroSection />
      <MobileQuickActions />
      <ValuesStrip />
      <ApproachesSection />
      <GagnoteSection />
      <FAQSection />
      <QuoteSection />
    </>
  );
}

function MobileQuickActions() {
  const { t } = useTranslation();
  const actions: ReadonlyArray<{
    href: string;
    Icon: typeof Calendar;
    label: string;
    primary?: boolean;
    external?: boolean;
  }> = [
    { href: CALENDLY_URL, Icon: Calendar, label: t("cta.bookNow"), primary: true, external: true },
    { href: PHONE_HREF, Icon: Phone, label: PHONE_DISPLAY },
    { href: WHATSAPP_HREF, Icon: MessageCircle, label: t("contact.whatsapp"), external: true },
    { href: `mailto:${EMAIL}`, Icon: Mail, label: t("contact.email") },
  ];


  return (
    <section className="bg-cream px-4 pt-6 pb-2 lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-3">
        {actions.map(({ href, Icon, label, primary, external }) => (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-center transition-all active:scale-95 ${
              primary
                ? "bg-forest text-cream shadow-md shadow-forest/20"
                : "bg-cream-warm text-forest ring-1 ring-gold/20"
            }`}
          >
            <Icon className={`size-5 ${primary ? "text-gold" : "text-forest"}`} aria-hidden="true" />
            <span className="text-[0.62rem] font-medium leading-tight">{label}</span>
          </a>
        ))}
      </div>
    </section>
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
          <h1 className="mt-6 font-serif text-[2.5rem] leading-[1.05] text-cream sm:text-5xl md:text-6xl lg:text-7xl">
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
                {PHONE_DISPLAY}
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

        <div className="mt-10 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-14 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3 xl:grid-cols-5">
          {approaches.map((item, idx) => {
            const Icon = APPROACH_ICONS[idx] ?? Sparkles;
            const image = APPROACH_IMAGES[idx] ?? approachEnergy;
            return (
              <article key={item.title} className="group flex w-[78vw] shrink-0 snap-center flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-gold/20 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-forest/10 sm:w-auto sm:rounded-lg">
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
    <section className="bg-forest py-20 text-cream">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <LeafDivider className="mb-8 text-gold" />
        <span className="eyebrow text-gold">{t("home.gagnoteEyebrow")}</span>
        <h2 className="mt-4 font-serif text-3xl md:text-4xl">{t("home.gagnoteTitle")}</h2>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          <div className="text-center">
            <p className="font-serif text-3xl text-gold">100%</p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-cream/60">Gratuit</p>
          </div>
          <div className="hidden h-8 w-px bg-cream/20 sm:block" />
          <div className="text-center">
            <p className="font-serif text-3xl text-gold">
              <Users className="inline size-7" aria-hidden="true" />
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-cream/60">Pour vous</p>
          </div>
          <div className="hidden h-8 w-px bg-cream/20 sm:block" />
          <div className="text-center">
            <p className="font-serif text-3xl text-gold">♡</p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-cream/60">Solidarité</p>
          </div>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-cream/85 md:text-base">{t("home.gagnoteP1")}</p>
        <p className="mt-4 text-sm leading-relaxed text-cream/85 md:text-base">{t("home.gagnoteP2")}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-md border border-cream/30 px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream hover:border-cream hover:bg-cream/10"
          >
            {t("home.gagnoteCta")} <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/don"
            className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-xs uppercase tracking-[0.18em] text-forest hover:bg-gold-soft"
          >
            <Heart className="size-4" />
            {t("home.gagnoteDonate")}
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-cream/40">
          <span className="text-xs uppercase tracking-[0.12em]">Paiement via</span>
          <span className="rounded border border-cream/20 px-3 py-1 text-xs font-bold tracking-wide text-cream/40">
            PayPal
          </span>
          <span className="rounded border border-cream/20 px-3 py-1 text-xs font-bold tracking-wide text-cream/40">
            VISA
          </span>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { t } = useTranslation();
  const faq = t("home.faq", { returnObjects: true }) as Array<{ question: string; answer: string }>;
  return (
    <section className="bg-cream-warm py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="eyebrow text-gold">{t("home.faqEyebrow")}</span>
          <h2 className="mt-4 font-serif text-4xl text-forest md:text-5xl">{t("home.faqTitle")}</h2>
          <LeafDivider className="mt-6" />
        </div>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faq.map((item, idx) => (
            <AccordionItem
              key={item.question}
              value={`faq-${idx}`}
              className="rounded-lg border-none bg-card px-6 ring-1 ring-gold/20"
            >
              <AccordionTrigger className="font-serif text-base text-forest hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-earth/75">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
