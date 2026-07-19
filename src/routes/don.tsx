import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, Lock, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LeafDivider } from "../components/site/leaf-divider";
import { getPublicSettings, type PublicSettings } from "../lib/settings.functions";
import { buildSeoHead } from "../lib/seo";
import { getServerLocale } from "../lib/locale-server";
import { tServer } from "../lib/t-server";
import { WHATSAPP_HREF } from "../lib/config";
import forestPath from "../assets/forest-path.jpg";

export const Route = createFileRoute("/don")({
  loader: async () => {
    const locale = await getServerLocale();
    let settings: PublicSettings = {
      paypal_client_id: "",
      donation_amounts: [5, 10, 20, 50],
      legal_editor_name: "",
      legal_editor_status: "",
      legal_editor_siret: "",
      legal_editor_address: "",
      legal_publication_director: "",
    };
    try {
      settings = await getPublicSettings();
    } catch (error) {
      void error;
    }
    const stripeEnabled = Boolean(process.env.STRIPE_SK_KEY);
    return { locale, settings, stripeEnabled };
  },
  head: ({ loaderData }) => {
    const loc = loaderData?.locale ?? "fr";
    const head = buildSeoHead({
      path: "/don",
      title: tServer(loc, "seo.donate.title"),
      description: tServer(loc, "seo.donate.description"),
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
                name: "Où vont les dons collectés par Jabamiah ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "100% des dons sont intégralement reversés à des associations partenaires et à la Ligue contre le Cancer. Aucune commission n'est prélevée.",
                },
              },
              {
                "@type": "Question",
                name: "Comment faire un don à Jabamiah ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Via carte bancaire (Visa, Mastercard) directement sur la page don, avec un paiement sécurisé Stripe Checkout.",
                },
              },
              {
                "@type": "Question",
                name: "Les consultations sont gratuites, pourquoi faire un don ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Les soins sont et resteront toujours gratuits. Vos dons volontaires permettent de soutenir des causes humanitaires et la recherche contre le cancer. Aucune pression, aucune obligation.",
                },
              },
            ],
          }),
        },
      ],
    };
  },
  component: DonatePage,
});

function DonatePage() {
  const { settings, stripeEnabled } = Route.useLoaderData();
  const { t } = useTranslation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [checkoutState, setCheckoutState] = useState<"idle" | "loading" | "error">("idle");
  const [paymentNotice, setPaymentNotice] = useState<"success" | "cancel" | null>(null);

  const isPaymentActive = stripeEnabled;
  const amounts =
    settings.donation_amounts.length > 0 ? settings.donation_amounts : [5, 10, 20, 50];
  const amountValue = customAmount ? Number(customAmount) : selectedAmount;
  const effectiveAmount = amountValue && amountValue > 0 ? amountValue : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payment = new URLSearchParams(window.location.search).get("payment");
    if (payment === "success") setPaymentNotice("success");
    else if (payment === "cancel") setPaymentNotice("cancel");
  }, []);

  async function startStripeCheckout() {
    if (!effectiveAmount || checkoutState === "loading") return;
    setCheckoutState("loading");
    try {
      const response = await fetch("/api/public/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount }),
      });
      const data = (await response.json()) as { url?: string };
      if (!response.ok || !data.url) {
        setCheckoutState("error");
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      void error;
      setCheckoutState("error");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="absolute inset-0">
          <img src={forestPath} alt="" className="size-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-linear-to-b from-forest/80 via-forest/70 to-forest/90" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <LeafDivider className="mb-8 text-gold" />
          <span className="eyebrow text-gold">{t("donate.eyebrow")}</span>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">
            {t("donate.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/85">
            {t("donate.subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="font-serif text-3xl text-gold">100%</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-cream/60">Gratuit</p>
            </div>
            <div className="w-px bg-cream/20" />
            <div className="text-center">
              <p className="font-serif text-3xl text-gold">♡</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-cream/60">Pour vous</p>
            </div>
            <div className="w-px bg-cream/20" />
            <div className="text-center">
              <p className="font-serif text-3xl text-gold">∞</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-cream/60">Solidarité</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-cream py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          {/* Left: causes */}
          <div>
            <h2 className="font-serif text-2xl text-forest">{t("donate.causesTitle")}</h2>
            <LeafDivider className="mt-4 justify-start" />

            <div className="mt-8 space-y-5">
              <div className="rounded-xl bg-cream-warm p-6 ring-1 ring-gold/20">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest">
                    <Heart className="size-4 text-gold" />
                  </div>
                  <h3 className="font-serif text-lg text-forest">{t("donate.cause1Name")}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-earth/80">
                  {t("donate.cause1Text")}
                </p>
              </div>

              <div className="rounded-xl bg-cream-warm p-6 ring-1 ring-gold/20">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest">
                    <Heart className="size-4 text-gold" />
                  </div>
                  <h3 className="font-serif text-lg text-forest">{t("donate.cause2Name")}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-earth/80">
                  {t("donate.cause2Text")}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gold/30 bg-cream p-6">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 size-5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-serif text-lg text-forest">
                    {t("donate.transparencyTitle")}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-earth/80">
                    {t("donate.transparencyText")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: donation widget */}
          <div>
            <h2 className="font-serif text-2xl text-forest">{t("donate.payTitle")}</h2>
            <LeafDivider className="mt-4 justify-start" />

            <div className="mt-8 rounded-2xl bg-card p-8 ring-1 ring-gold/20">
              {paymentNotice === "success" && (
                <div className="mb-4 rounded-lg border border-forest/20 bg-forest/10 px-4 py-3 text-sm text-forest">
                  Merci pour votre don. Votre paiement a bien ete confirme.
                </div>
              )}
              {paymentNotice === "cancel" && (
                <div className="mb-4 rounded-lg border border-gold/30 bg-cream-warm px-4 py-3 text-sm text-earth/80">
                  Paiement annule. Vous pouvez reprendre votre don a tout moment.
                </div>
              )}

              {/* Amount selector */}
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-forest">
                {t("donate.amountTitle")}
              </p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {amounts.map((amount: number) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`rounded-lg border py-3 text-center text-sm font-medium transition-all ${
                      selectedAmount === amount && !customAmount
                        ? "border-gold bg-forest text-cream"
                        : "border-gold/30 bg-cream-warm text-forest hover:border-gold"
                    }`}
                  >
                    {amount}€
                  </button>
                ))}
              </div>

              <div className="mt-3">
                <input
                  type="number"
                  min="1"
                  placeholder={t("donate.customAmount")}
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full rounded-lg border border-gold/30 bg-cream-warm px-4 py-3 text-sm text-forest placeholder-earth/50 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Payment area */}
              <div className="mt-6">
                {isPaymentActive ? (
                  <div className="rounded-xl border border-gold/30 bg-cream-warm/60 px-6 py-6 text-center">
                    <button
                      type="button"
                      onClick={startStripeCheckout}
                      disabled={!effectiveAmount || checkoutState === "loading"}
                      className="inline-flex items-center justify-center rounded-md bg-forest px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream transition hover:bg-forest-soft disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {checkoutState === "loading"
                        ? "Redirection..."
                        : `Payer ${effectiveAmount ?? ""} EUR par carte`}
                    </button>
                    <p className="mt-3 text-xs text-earth/70">
                      Paiement securise via Stripe Checkout
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-3">
                      <span className="rounded border border-earth/20 bg-cream px-3 py-1.5 text-xs font-bold tracking-wider text-earth/60">
                        VISA
                      </span>
                      <span className="rounded border border-earth/20 bg-cream px-3 py-1.5 text-xs font-bold tracking-wider text-earth/60">
                        Mastercard
                      </span>
                    </div>
                    {checkoutState === "error" && (
                      <p className="mt-3 text-xs text-red-700">
                        Impossible de demarrer le paiement. Veuillez reessayer.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border-2 border-dashed border-gold/40 bg-cream-warm/60 px-6 py-8 text-center">
                    <Lock className="mx-auto size-8 text-gold/50" aria-hidden="true" />
                    <p className="mt-3 font-serif text-xl text-forest">{t("donate.pending")}</p>
                    <p className="mt-2 text-sm leading-relaxed text-earth/70">
                      {t("donate.pendingSub")}
                    </p>
                    <div className="mt-5 flex items-center justify-center gap-3">
                      <span className="rounded border border-earth/20 bg-cream px-3 py-1.5 text-xs font-bold tracking-wider text-earth/40">
                        PayPal
                      </span>
                      <span className="rounded border border-earth/20 bg-cream px-3 py-1.5 text-xs font-bold tracking-wider text-earth/40">
                        VISA
                      </span>
                      <span className="rounded border border-earth/20 bg-cream px-3 py-1.5 text-xs font-bold tracking-wider text-earth/40">
                        Mastercard
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-gold/15 pt-6 text-center">
                <p className="text-xs text-earth/60">{t("donate.altContact")}</p>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gold hover:text-forest"
                >
                  {t("donate.contactCta")} <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="bg-cream-warm py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <LeafDivider className="mb-8" />
          <p className="font-serif text-2xl italic text-earth/85 md:text-3xl">
            « Le bien que tu fais aujourd'hui, revient toujours à ton âme. »
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-md border border-gold/40 px-6 py-3 text-xs uppercase tracking-[0.18em] text-forest hover:border-gold hover:bg-cream"
            >
              {t("cta.learnMore")} <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-forest px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
            >
              {t("contact.eyebrow")} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
