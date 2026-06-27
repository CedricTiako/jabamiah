import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PLANTS } from "../content/plants";
import { localized, localizedList } from "../content/therapies";
import { LeafDivider } from "../components/site/leaf-divider";
import heroImage from "../assets/approach-plants.jpg";

export const Route = createFileRoute("/plantes-et-remedes")({
  head: () => ({
    meta: [
      { title: "Plantes & Remèdes naturels — Jabamiah" },
      {
        name: "description",
        content: "La sagesse des plantes médicinales et des remèdes naturels au service de votre bien-être.",
      },
    ],
  }),
  component: PlantsPage,
});

function PlantsPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage ?? "fr").slice(0, 2);

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="size-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-linear-to-r from-forest/95 via-forest/75 to-forest/45" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="eyebrow text-gold">{t("plantsPage.eyebrow")}</span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
            {t("plantsPage.title1")}
            <br />
            <em className="not-italic italic text-gold">{t("plantsPage.title2")}</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-cream/85">{t("plantsPage.subtitle")}</p>
          <LeafDivider className="mt-8 text-gold" />
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANTS.map((plant) => (
              <article key={plant.slug} className="group overflow-hidden rounded-lg bg-card ring-1 ring-gold/20 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-forest/10">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={plant.image}
                    alt={localized(plant.commonName, locale)}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl text-forest">{localized(plant.commonName, locale)}</h3>
                  <p className="mt-1 text-xs italic text-gold">{plant.latinName}</p>
                  <div className="mt-4">
                    <p className="eyebrow text-earth/60">{t("plantsPage.properties")}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {localizedList(plant.properties, locale).map((prop) => (
                        <li
                          key={prop}
                          className="rounded-full bg-cream-warm px-3 py-1 text-xs text-forest ring-1 ring-gold/20"
                        >
                          {prop}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <p className="eyebrow text-earth/60">{t("plantsPage.uses")}</p>
                    <p className="mt-2 text-xs leading-relaxed text-earth/75">
                      {localized(plant.uses, locale)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-warm py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-serif text-4xl text-forest md:text-5xl">{t("plantsPage.remediesTitle")}</h2>
          <LeafDivider className="mt-5" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {(t("plantsPage.remedies", { returnObjects: true }) as Array<{ title: string; text: string }>).map(
              (remedy, idx) => (
                <div key={idx} className="rounded-2xl bg-cream p-8 text-left ring-1 ring-gold/20">
                  <div className="flex size-12 items-center justify-center rounded-full bg-cream-warm ring-1 ring-gold/30">
                    <Leaf className="size-5 text-gold" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-forest">{remedy.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-earth/75">{remedy.text}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-start gap-4 rounded-2xl border border-gold/40 bg-cream-warm/60 p-6">
            <AlertTriangle className="mt-0.5 size-6 shrink-0 text-gold" aria-hidden="true" />
            <div>
              <h3 className="font-serif text-xl text-forest">{t("plantsPage.disclaimerTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-earth/75">{t("plantsPage.disclaimer")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
