import { createFileRoute, Link } from "@tanstack/react-router";
import { Quote, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TESTIMONIALS, type TestimonialCategory } from "../content/testimonials";
import { localized } from "../content/therapies";
import { LeafDivider } from "../components/site/leaf-divider";
import heroImage from "../assets/hero-about.jpg";
import { getServerLocale } from "../lib/locale-server";
import { tServer } from "../lib/t-server";

export const Route = createFileRoute("/temoignages")({
  loader: async () => ({ locale: await getServerLocale() }),
  head: ({ loaderData }) => {
    const loc = loaderData?.locale ?? "fr";
    return {
      meta: [
        { title: tServer(loc, "seo.temoignages.title") },
        { name: "description", content: tServer(loc, "seo.temoignages.description") },
      ],
    };
  },
  component: TestimonialsPage,
});

const CATEGORY_LABELS_FR: Record<TestimonialCategory, string> = {
  energetique: "Soin énergétique",
  guerison: "Guérison",
  spirituel: "Accompagnement spirituel",
};

function TestimonialsPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage ?? "fr").slice(0, 2);
  const [filter, setFilter] = useState<TestimonialCategory | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? TESTIMONIALS : TESTIMONIALS.filter((x) => x.category === filter)),
    [filter],
  );

  const categories: Array<TestimonialCategory | "all"> = ["all", "energetique", "guerison", "spirituel"];

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" width={1920} height={1280} className="size-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-linear-to-r from-forest/95 via-forest/80 to-forest/50" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="eyebrow text-gold">{t("testimonialsPage.eyebrow")}</span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">
            {t("testimonialsPage.title1")}{" "}
            <em className="not-italic italic text-gold">{t("testimonialsPage.title2")}</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-cream/85">
            {t("testimonialsPage.subtitle")}
          </p>
          <LeafDivider className="mt-8 text-gold" />
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.15em] transition-all ${
                  filter === cat
                    ? "border-forest bg-forest text-cream"
                    : "border-gold/30 bg-cream-warm/40 text-earth/70 hover:border-gold"
                }`}
              >
                {cat === "all" ? t("testimonialsPage.filterAll") : CATEGORY_LABELS_FR[cat]}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((testimonial) => (
              <article
                key={testimonial.id}
                className="flex flex-col rounded-2xl bg-card p-7 ring-1 ring-gold/20"
              >
                <Quote className="size-7 text-gold/60" aria-hidden="true" />
                <p className="mt-4 flex-1 font-serif text-base italic leading-relaxed text-earth/85">
                  « {localized(testimonial.body, locale)} »
                </p>
                <div className="mt-6 flex items-center gap-1 text-gold">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-gold" />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 border-t border-gold/15 pt-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-cream-warm font-serif text-gold ring-1 ring-gold/30">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-forest">{testimonial.name}</p>
                    <p className="text-xs text-earth/60">{testimonial.city}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-warm py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-serif text-3xl text-forest md:text-4xl">
            {t("testimonialsPage.shareTitle")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-earth/80">{t("testimonialsPage.shareText")}</p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-forest px-7 py-4 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
          >
            {t("testimonialsPage.shareCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
