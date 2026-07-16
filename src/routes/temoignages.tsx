import { createFileRoute } from "@tanstack/react-router";
import { Quote, Star, Send } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { TESTIMONIALS, type TestimonialCategory } from "../content/testimonials";
import { localized } from "../content/therapies";
import { LeafDivider } from "../components/site/leaf-divider";
import heroImage from "../assets/hero-about.jpg";
import { buildSeoHead } from "../lib/seo";
import { getServerLocale } from "../lib/locale-server";
import { tServer } from "../lib/t-server";
import { listApprovedReviews } from "../lib/reviews.functions";

export const Route = createFileRoute("/temoignages")({
  loader: async () => ({ locale: await getServerLocale() }),
  head: ({ loaderData }) => {
    const loc = loaderData?.locale ?? "fr";
    return buildSeoHead({
      path: "/temoignages",
      title: tServer(loc, "seo.temoignages.title"),
      description: tServer(loc, "seo.temoignages.description"),
    });
  },
  component: TestimonialsPage,
});

const CATEGORY_LABELS_FR: Record<TestimonialCategory, string> = {
  energetique: "Soin énergétique",
  guerison: "Guérison",
  spirituel: "Accompagnement spirituel",
};

type FormStatus = "idle" | "sending" | "success" | "error";

function TestimonialsPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage ?? "fr").slice(0, 2);
  const [filter, setFilter] = useState<TestimonialCategory | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? TESTIMONIALS : TESTIMONIALS.filter((x) => x.category === filter)),
    [filter],
  );

  const listReviews = useServerFn(listApprovedReviews);
  const { data: realReviews } = useQuery({ queryKey: ["approved-reviews"], queryFn: () => listReviews() });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rating, setRating] = useState(5);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      author_name: String(fd.get("author_name") ?? "").trim(),
      author_email: String(fd.get("author_email") ?? "").trim(),
      rating,
      body: String(fd.get("body") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
    };
    if (payload.author_name.length < 2) { setErrorMsg(t("testimonialsPage.formNameMin")); setStatus("error"); return; }
    if (payload.body.length < 10) { setErrorMsg(t("testimonialsPage.formBodyMin")); setStatus("error"); return; }

    setStatus("sending");
    try {
      const res = await fetch("/api/public/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send-failed");
      setStatus("success");
      form.reset();
      setRating(5);
    } catch {
      setStatus("error");
      setErrorMsg(t("testimonialsPage.formError"));
    }
  }

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

      {realReviews && realReviews.length > 0 && (
        <section className="bg-cream-warm/60 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center font-serif text-3xl text-forest md:text-4xl">
              {t("testimonialsPage.realReviewsTitle")}
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {realReviews.map((r) => (
                <article key={r.id} className="flex flex-col rounded-2xl bg-card p-7 ring-1 ring-gold/20">
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-gold" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 font-serif text-base italic leading-relaxed text-earth/85">« {r.body} »</p>
                  <p className="mt-4 border-t border-gold/15 pt-4 text-sm font-medium text-forest">{r.author_name}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-cream py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-serif text-3xl text-forest md:text-4xl">
            {t("testimonialsPage.shareTitle")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-earth/80">{t("testimonialsPage.shareText")}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left" noValidate aria-describedby="review-form-status">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("testimonialsPage.formName")}</span>
              <input
                name="author_name"
                type="text"
                required
                minLength={2}
                className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("testimonialsPage.formEmail")}</span>
              <input
                name="author_email"
                type="email"
                className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>
            <div>
              <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("testimonialsPage.formRating")}</span>
              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`${value} / 5`}
                      className="p-1"
                    >
                      <Star className={`size-6 ${value <= rating ? "fill-gold text-gold" : "text-earth/25"}`} />
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("testimonialsPage.formBody")}</span>
              <textarea
                name="body"
                required
                minLength={10}
                rows={5}
                className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </label>

            <div id="review-form-status" aria-live="polite">
              {status === "error" && errorMsg && (
                <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</p>
              )}
              {status === "success" && (
                <p className="rounded-md bg-forest/10 px-3 py-2 text-sm text-forest">{t("testimonialsPage.formSuccess")}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-md bg-forest px-7 py-4 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft disabled:opacity-60"
            >
              <Send className="size-4" />
              {status === "sending" ? t("testimonialsPage.formSending") : t("testimonialsPage.formSubmit")}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
