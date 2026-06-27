import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  Compass,
  Heart,
  Leaf,
  Lock,
  Sparkles,
  Sun,
} from "lucide-react";
import heroAbout from "../assets/hero-about.jpg";
import forestPath from "../assets/forest-path.jpg";
import { LeafDivider } from "../components/site/leaf-divider";

const CALENDLY_URL = "https://calendly.com/eirl-omont/60min";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Jabamiah, un chemin de cœur au service de l'humain" },
      {
        name: "description",
        content:
          "Découvrez Jabamiah, medium et thérapeute holistique animé par l'amour et le besoin d'aider. Consultations énergétiques gratuites sur rendez-vous.",
      },
      { property: "og:title", content: "À propos — Jabamiah" },
      {
        property: "og:description",
        content:
          "Un chemin de cœur au service de l'humain. Consultations 100% gratuites sur rendez-vous.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Heart,
    title: "Le bienveillance est ma boussole.",
    text: "Elle guide chacune de mes actions.",
  },
  {
    icon: Leaf,
    title: "L'amour inconditionnel est ma force.",
    text: "Il me permet d'accueillir chaque être avec respect et sans jugement.",
  },
  {
    icon: Sparkles,
    title: "L'élévation de l'âme est ma mission.",
    text: "Aider chacun à se reconnecter à sa lumière et à retrouver son équilibre.",
  },
];

const PILLARS = [
  {
    icon: Heart,
    title: "Écoute & accueil",
    text:
      "Je vous écoute avec le cœur, dans la bienveillance et le respect total de qui vous êtes.",
  },
  {
    icon: Sparkles,
    title: "Énergie & équilibre",
    text:
      "J'utilise des soins énergétiques et des méthodes naturelles pour réharmoniser votre être.",
  },
  {
    icon: Leaf,
    title: "Plantes & nature",
    text:
      "Les plantes médicinales et les remèdes naturels sont de puissants alliés pour le corps et l'âme.",
  },
  {
    icon: Compass,
    title: "Guidance & lumière",
    text:
      "Je vous guide vers vos propres réponses pour que vous retrouviez votre force intérieure.",
  },
  {
    icon: Sun,
    title: "Évolution & paix",
    text:
      "Mon rôle est de vous aider à avancer sur votre chemin de vie en paix, avec vous-même et les autres.",
  },
];

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
  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <div className="absolute inset-0">
        <img
          src={heroAbout}
          alt=""
          width={1920}
          height={1280}
          className="size-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/55 to-forest/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <span className="eyebrow text-gold">Qui je suis</span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
            Un chemin de <em className="not-italic italic text-gold">cœur</em>
            <br /> au service de <em className="not-italic italic text-gold">l'humain</em>.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/85 md:text-lg">
            Je suis un être humain avant tout, guidé par la lumière, l'amour et le besoin profond
            d'aider mon prochain.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/80">
            Depuis toujours, j'ai ressenti en moi ce devoir de faire le bien, d'apporter du
            réconfort, d'écouter, d'accompagner et de soulager les souffrances invisibles.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-md border border-gold/30 bg-forest-deep/70 px-5 py-4 backdrop-blur">
              <Heart className="size-5 text-gold" aria-hidden="true" />
              <div className="text-xs uppercase tracking-[0.15em] text-cream/85">
                Mes consultations sont
                <span className="block text-gold">totalement gratuites</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-gold/30 bg-forest-deep/70 px-5 py-4 backdrop-blur">
              <Calendar className="size-5 text-gold" aria-hidden="true" />
              <div className="text-xs uppercase tracking-[0.15em] text-cream/85">
                Sur rendez-vous
                <span className="block text-cream/70 normal-case tracking-normal">
                  Je suis là pour vous.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="font-serif text-4xl text-forest md:text-5xl">Pourquoi je le fais</h2>
          <LeafDivider className="mt-5" />
          <p className="mt-6 font-serif text-xl italic text-earth/80">
            J'aide les gens parce que j'ai le devoir de faire le bien.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="space-y-5 text-sm leading-relaxed text-earth/85 lg:col-span-4">
            <p>J'ai toujours voulu être quelqu'un de bien.</p>
            <p>
              Même si parfois, comme tout le monde, nous faisons tous des choses interdites.
            </p>
            <p>
              Mais dans le fond, mon âme me rappelle le chemin à suivre pour toujours être meilleur
              avec moi-même et mon prochain.
            </p>
          </div>

          <ul className="space-y-5 lg:col-span-4">
            {VALUES.map((value) => (
              <li key={value.title} className="flex items-start gap-4">
                <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-cream-warm ring-1 ring-gold/30">
                  <value.icon className="size-4 text-gold" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-forest">{value.title}</h3>
                  <p className="mt-1 text-sm text-earth/75">{value.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="relative overflow-hidden rounded-2xl lg:col-span-4">
            <img
              src={forestPath}
              alt=""
              width={800}
              height={1000}
              loading="lazy"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-forest/60" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <blockquote className="text-center font-serif text-base italic leading-relaxed text-cream md:text-lg">
                « Mon intention est simple : apporter lumière, espoir et guérison à ceux qui en ont
                besoin, sans rien attendre en retour. »
                <LeafDivider className="mt-4 text-gold" />
                <p className="mt-3 text-sm not-italic tracking-wide text-cream/85">
                  Votre bien-être est sacré.
                  <br />
                  Votre guérison est possible.
                  <br />
                  Vous n'êtes jamais seul(e).
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PillarsSection() {
  return (
    <section className="bg-cream-warm py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="font-serif text-4xl text-forest md:text-5xl">Comment je vous accompagne</h2>
          <LeafDivider className="mt-5" />
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-cream ring-1 ring-gold/30">
                <pillar.icon className="size-6 text-gold" aria-hidden="true" />
              </div>
              <h3 className="eyebrow mt-5 text-forest">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-earth/75">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationCTA() {
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
                <h2 className="font-serif text-2xl text-cream md:text-3xl">
                  Consultation gratuite sur rendez-vous
                </h2>
                <p className="mt-2 text-sm text-cream/80">
                  Je vous offre mon temps, mon écoute et mon énergie avec amour et générosité.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 lg:col-span-6 lg:items-end">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-gold px-8 py-4 text-sm uppercase tracking-[0.18em] text-forest shadow-md hover:bg-gold-soft"
              >
                Prendre rendez-vous
              </a>
              <p className="font-serif italic text-cream/85">Je suis là pour vous aider.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 border-t border-cream/15 pt-8 sm:grid-cols-3 text-xs">
            <MiniInfo
              icon={Heart}
              title="100% gratuit"
              text="Parce que l'aide ne doit pas avoir de prix."
            />
            <MiniInfo
              icon={Calendar}
              title="Sur rendez-vous"
              text="Prenez le temps qu'il vous faut, je suis là pour vous."
            />
            <MiniInfo
              icon={Lock}
              title="En toute confidentialité"
              text="Votre histoire reste entre nous, en toute sécurité."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniInfo({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Heart;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
      <div>
        <p className="uppercase tracking-[0.18em] text-cream">{title}</p>
        <p className="mt-1 text-cream/70">{text}</p>
      </div>
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
