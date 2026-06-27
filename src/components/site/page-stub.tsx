import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";

type StubProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageStub({ eyebrow, title, description }: StubProps) {
  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="eyebrow text-gold">{eyebrow}</span>
        <h1 className="mt-5 font-serif text-4xl text-forest md:text-5xl">{title}</h1>
        <p className="mt-6 text-base leading-relaxed text-earth/75">{description}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://calendly.com/eirl-omont/60min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-forest px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
          >
            <Calendar className="size-4 text-gold" /> Prendre rendez-vous
          </a>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-6 py-3 text-xs uppercase tracking-[0.18em] text-forest hover:bg-cream-warm"
          >
            Accueil <ArrowRight className="size-4" />
          </Link>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.18em] text-earth/50">
          Cette page sera bientôt enrichie.
        </p>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/_stub")({
  component: () => null,
});
