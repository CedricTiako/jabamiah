import { createFileRoute } from "@tanstack/react-router";
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
  Star,
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

const CALENDLY_URL = "https://calendly.com/eirl-omont/60min";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jabamiah — Soins énergétiques & médecine parallèle" },
      {
        name: "description",
        content:
          "Retrouvez l'équilibre du corps, de l'esprit et de l'âme. Consultations énergétiques 100% gratuites avec Jabamiah, à Forges-les-Eaux ou à distance.",
      },
      { property: "og:title", content: "Jabamiah — Soins énergétiques & médecine parallèle" },
      {
        property: "og:description",
        content:
          "Approches naturelles et holistiques pour réactiver votre énergie vitale et vous accompagner vers votre plein potentiel.",
      },
    ],
  }),
  component: HomePage,
});

const VALUES = [
  {
    icon: Leaf,
    title: "Approche naturelle",
    text: "Des méthodes douces et respectueuses de votre être.",
  },
  {
    icon: Ear,
    title: "Écoute & bienveillance",
    text: "Un accompagnement humain, sans jugement, en toute confiance.",
  },
  {
    icon: Sparkles,
    title: "Énergie & harmonie",
    text: "Rééquilibrez vos énergies et retrouvez votre vitalité.",
  },
  {
    icon: Compass,
    title: "Soutien global",
    text: "Un engagement pour le bien de tous, ici et ailleurs.",
  },
];

const APPROACHES = [
  {
    image: approachEnergy,
    icon: Sparkles,
    title: "Soins énergétiques",
    text: "Rééquilibrez vos énergies, libérez les blocages et retrouvez votre harmonie.",
  },
  {
    image: approachMind,
    icon: Sun,
    title: "Guérison par la pensée",
    text: "Transformez vos pensées limitantes et activez votre pouvoir d'auto-guérison.",
  },
  {
    image: approachPlants,
    icon: Leaf,
    title: "Plantes & remèdes naturels",
    text: "La sagesse des plantes au service de votre bien-être et de votre équilibre naturel.",
  },
  {
    image: approachHarmony,
    icon: Compass,
    title: "Harmonisation globale",
    text: "Travail sur le corps, l'esprit et l'âme pour une harmonie profonde et durable.",
  },
  {
    image: approachSpirit,
    icon: HeartHandshake,
    title: "Développement spirituel",
    text: "Élevez votre conscience et reconnectez-vous à votre essence profonde.",
  },
];

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
  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          width={1920}
          height={1280}
          className="size-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/60 to-forest/30" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <span className="eyebrow text-gold">Soins énergétiques & médecine naturelle</span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-cream md:text-6xl lg:text-7xl">
            Retrouvez l'équilibre
            <br /> du <em className="not-italic text-gold">corps</em>, de
            <em className="not-italic italic text-gold"> l'esprit</em>
            <br /> et de <em className="not-italic italic text-gold">l'âme</em>.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
            Des approches naturelles et holistiques pour réactiver votre énergie vitale, apaiser
            votre esprit et vous accompagner vers votre plein potentiel.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-md bg-gold px-7 py-4 text-sm uppercase tracking-[0.18em] text-forest shadow-lg shadow-gold/20 transition-all hover:bg-gold-soft"
            >
              <Calendar className="size-4" aria-hidden="true" />
              <span className="flex flex-col items-start leading-tight">
                <span className="font-semibold">Prendre rendez-vous</span>
                <span className="text-[0.65rem] tracking-[0.18em] text-forest/70">
                  Consultation gratuite
                </span>
              </span>
            </a>
            <a
              href="#mes-approches"
              className="inline-flex items-center gap-3 rounded-md border border-cream/30 bg-cream/5 px-6 py-4 text-sm uppercase tracking-[0.18em] text-cream backdrop-blur hover:bg-cream/15"
            >
              <ArrowRight className="size-4 text-gold" aria-hidden="true" />
              <span className="flex flex-col items-start leading-tight">
                <span>Découvrir</span>
                <span className="text-[0.65rem] tracking-[0.18em] text-cream/70">mes approches</span>
              </span>
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-9 rounded-full border-2 border-forest bg-gradient-to-br from-cream-warm to-gold/40"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-gold">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-3 fill-gold" />
                ))}
              </div>
              <p className="mt-1 text-sm text-cream/80">
                + de 500 personnes accompagnées <span className="text-gold">♡</span>
                <span className="block text-xs text-cream/60">avec bienveillance</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-xl border border-gold/30 bg-forest-deep/80 p-7 backdrop-blur">
            <h2 className="flex items-center gap-2 font-serif text-xl text-cream">
              <Leaf className="size-5 text-gold" aria-hidden="true" />
              Consultations 100% gratuites
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-cream/85">
              {[
                "Soins énergétiques",
                "Guérison par la pensée",
                "Plantes médicinales & remèdes naturels",
                "Écoute, guidance & libération émotionnelle",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Leaf className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-3 border-t border-cream/10 pt-4 text-xs text-cream/70">
              <span className="h-px w-6 bg-gold" />
              <Sparkles className="size-3.5 text-gold" aria-hidden="true" />
              Sur rendez-vous
            </div>
          </div>

          <div className="rounded-xl border border-gold/30 bg-forest-deep/80 p-7 backdrop-blur">
            <div className="flex items-center gap-3 text-cream">
              <Calendar className="size-5 text-gold" aria-hidden="true" />
              <h3 className="eyebrow text-cream">Prendre rendez-vous</h3>
            </div>
            <p className="mt-3 text-sm text-gold">Consultations gratuites sur rendez-vous</p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-between rounded-md bg-gradient-to-r from-gold to-gold-soft px-5 py-3.5 text-xs uppercase tracking-[0.18em] text-forest hover:opacity-95"
            >
              <span className="font-semibold">Réserver maintenant</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <p className="mt-3 text-center text-xs text-cream/60">En présentiel ou à distance</p>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-cream/10 pt-4 text-[0.65rem] uppercase tracking-[0.15em] text-cream/70">
              <a
                href="tel:+33745155451"
                className="flex flex-col items-center gap-1 hover:text-gold"
              >
                <Phone className="size-4 text-gold" aria-hidden="true" />
                Téléphone
              </a>
              <a
                href="https://wa.me/33745155451"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 hover:text-gold"
              >
                <MessageCircle className="size-4 text-gold" aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href="mailto:contact@jabamiah.eu"
                className="flex flex-col items-center gap-1 hover:text-gold"
              >
                <Mail className="size-4 text-gold" aria-hidden="true" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesStrip() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 gap-x-6 px-6 md:grid-cols-4">
        {VALUES.map((value) => (
          <div key={value.title} className="flex flex-col items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-cream-warm ring-1 ring-gold/30">
              <value.icon className="size-7 text-gold" aria-hidden="true" />
            </div>
            <h3 className="eyebrow mt-5 text-forest">{value.title}</h3>
            <p className="mt-2 max-w-[16ch] text-xs leading-relaxed text-earth/70">
              {value.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApproachesSection() {
  return (
    <section id="mes-approches" className="bg-cream pb-24 pt-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="eyebrow text-gold">Mes Approches</span>
          <h2 className="mt-4 font-serif text-4xl text-forest md:text-5xl">
            Chaque être est unique,
          </h2>
          <p className="mt-2 font-serif text-2xl italic text-earth/80">
            chaque soin est personnalisé.
          </p>
          <LeafDivider className="mt-6" />
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {APPROACHES.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col overflow-hidden rounded-lg bg-card ring-1 ring-gold/20 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-forest/10"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 -bottom-7 flex justify-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-cream ring-1 ring-gold/40">
                    <item.icon className="size-6 text-gold" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col px-6 pb-7 pt-12 text-center">
                <h3 className="eyebrow text-forest">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-earth/75">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GagnoteSection() {
  return (
    <section className="bg-rose-soft/60 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
        <div className="relative lg:col-span-3">
          <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-rose-soft to-cream-warm shadow-inner">
            <div className="flex h-full items-center justify-center">
              <svg viewBox="0 0 120 160" className="size-32 text-[#e88a8a]" aria-hidden="true">
                {/* Awareness ribbon */}
                <path
                  d="M60 20c-10 10-25 35-25 60 0 22 12 35 25 60 13-25 25-38 25-60 0-25-15-50-25-60z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                <path
                  d="M48 60c5 8 17 8 24 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-center font-serif text-lg italic text-earth">
            Ensemble,
            <br />
            faisons la différence <span className="text-[#e88a8a]">♡</span>
          </p>
        </div>

        <div className="lg:col-span-6">
          <h2 className="text-center font-serif text-3xl tracking-wide text-forest md:text-4xl">
            GAGNOTE SOLIDAIRE <Users className="ml-2 inline size-6 text-gold" aria-hidden="true" />
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-earth/80 md:text-base">
            Si vous le souhaitez, vous pouvez contribuer librement via la gagnote après votre
            consultation. Chaque geste, <em className="italic">petit ou grand</em>, fait une réelle
            différence.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <Pillar
              icon={HeartHandshake}
              title="Vos dons soutiennent"
              text="des associations et des personnes atteintes de maladies graves."
            />
            <Pillar
              icon={Sparkles}
              title="Les fonds sont reversés"
              text="pour le cancer, les maladies rares et d'autres causes de santé."
            />
            <Pillar
              icon={Compass}
              title="Votre générosité apporte"
              text="de l'espoir, du soutien et de l'amour là où il en faut."
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-rose-soft bg-cream p-6 text-center shadow-sm">
            <h3 className="eyebrow text-[#c46868]">Faire un don</h3>
            <p className="mt-3 text-xs text-earth/70">
              Scannez le QR code
              <br />
              pour accéder à la gagnote
            </p>
            <div className="mx-auto mt-5 grid size-36 grid-cols-8 gap-0.5 rounded-md bg-cream-warm p-2">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[1px]"
                  style={{
                    background:
                      // pseudo QR pattern for visual until real URL provided
                      (i * 7 + (i % 5)) % 3 === 0 ? "var(--color-forest)" : "transparent",
                  }}
                />
              ))}
            </div>
            <p className="mt-5 font-serif italic text-earth/80">
              Merci du fond du cœur <span className="text-[#e88a8a]">♡</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Sparkles;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-cream-warm ring-1 ring-gold/30">
        <Icon className="size-5 text-gold" aria-hidden="true" />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-forest">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-earth/70">{text}</p>
    </div>
  );
}

function QuoteSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <img
        src={forestPath}
        alt=""
        width={1920}
        height={900}
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/40 to-forest/70" />
      <div className="relative mx-auto max-w-4xl px-6 text-center text-cream">
        <p className="font-serif text-2xl italic leading-relaxed md:text-3xl">
          « Le bien que tu fais aujourd'hui, revient toujours à ton âme. »
        </p>
        <LeafDivider className="mt-6 text-gold" />
      </div>
    </section>
  );
}
