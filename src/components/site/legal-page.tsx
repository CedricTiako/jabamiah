import type { ReactNode } from "react";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, lastUpdated, children }: LegalPageProps) {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-3xl px-6">
        <span className="eyebrow text-gold">{eyebrow}</span>
        <h1 className="mt-4 font-serif text-4xl text-forest md:text-5xl">{title}</h1>
        {lastUpdated ? (
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-earth/50">
            Dernière mise à jour : {lastUpdated}
          </p>
        ) : null}
        <div className="prose prose-sm mt-10 max-w-none text-earth/85 [&_a]:text-forest [&_a]:underline hover:[&_a]:text-gold [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-forest [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-forest [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_strong]:text-forest">
          {children}
        </div>
      </div>
    </section>
  );
}

export function TBD({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-gold/20 px-1 py-0.5 text-forest">
      [à compléter : {children}]
    </mark>
  );
}
