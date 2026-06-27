import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Compass, HeartHandshake, Leaf, Sparkles, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { findTherapy, localized, localizedList } from "../content/therapies";
import { LeafDivider } from "../components/site/leaf-divider";
import { CALENDLY_URL } from "../lib/config";
import { buildSeoHead, SITE_URL } from "../lib/seo";
import { getServerLocale } from "../lib/locale-server";

const ICONS = {
  sparkles: Sparkles,
  sun: Sun,
  leaf: Leaf,
  compass: Compass,
  "heart-handshake": HeartHandshake,
} as const;

export const Route = createFileRoute("/soins-et-therapies/$slug")({
  loader: async ({ params }) => {
    const therapy = findTherapy(params.slug);
    if (!therapy) throw notFound();
    return { therapy, locale: await getServerLocale() };
  },
  head: ({ loaderData }) => {
    const loc = loaderData?.locale ?? "fr";
    const therapy = loaderData?.therapy;
    const slug = therapy?.slug ?? "";
    const title = therapy ? `${localized(therapy.title, loc)} — Jabamiah` : "Soin — Jabamiah";
    const description = therapy ? localized(therapy.short, loc) : "";
    const head = buildSeoHead({ path: `/soins-et-therapies/${slug}`, title, description });
    return {
      ...head,
      scripts: therapy
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                name: localized(therapy.title, "fr"),
                description: localized(therapy.short, "fr"),
                provider: { "@type": "LocalBusiness", name: "Jabamiah", url: SITE_URL },
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "EUR",
                  availability: "https://schema.org/InStock",
                },
                areaServed: "France",
                url: `${SITE_URL}/soins-et-therapies/${slug}`,
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: "Soins & Thérapies", item: `${SITE_URL}/soins-et-therapies` },
                  { "@type": "ListItem", position: 3, name: localized(therapy.title, "fr"), item: `${SITE_URL}/soins-et-therapies/${slug}` },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: TherapyDetail,
});

function TherapyDetail() {
  const { therapy } = Route.useLoaderData();
  const { t, i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage ?? "fr").slice(0, 2);
  const Icon = ICONS[therapy.iconName as keyof typeof ICONS];

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="absolute inset-0">
          <img src={therapy.image} alt="" className="size-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-linear-to-r from-forest/95 via-forest/80 to-forest/50" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-20">
          <Link
            to="/soins-et-therapies"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cream/70 hover:text-gold"
          >
            <ArrowLeft className="size-4" />
            {t("therapiesPage.eyebrow")}
          </Link>
          <div className="mt-6 flex items-start gap-5">
            <div className="hidden size-16 shrink-0 items-center justify-center rounded-full border border-gold/40 sm:flex">
              <Icon className="size-7 text-gold" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">
                {localized(therapy.title, locale)}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/85">
                {localized(therapy.short, locale)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-earth/85">
              {localized(therapy.intro, locale)}
            </p>

            <h2 className="mt-12 font-serif text-3xl text-forest">{t("therapiesPage.benefits")}</h2>
            <LeafDivider className="mt-4 justify-start" />
            <ul className="mt-6 space-y-3 text-sm text-earth/85">
              {localizedList(therapy.benefits, locale).map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <Leaf className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl bg-forest p-8 text-cream">
              <h3 className="eyebrow text-gold">{t("therapiesPage.forWhom")}</h3>
              <p className="mt-4 text-sm leading-relaxed text-cream/85">
                {localized(therapy.forWhom, locale)}
              </p>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-md bg-gold px-6 py-4 text-xs uppercase tracking-[0.18em] text-forest hover:bg-gold-soft"
              >
                <Calendar className="size-4" />
                {t("therapiesPage.bookCta")}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
