import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { buildSeoHead } from "../lib/seo";
import { CALENDLY_EMBED_URL, EMAIL, PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from "../lib/config";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildSeoHead({
      path: "/contact",
      title: "Contact — Jabamiah",
      description:
        "Contactez Jabamiah pour une consultation énergétique gratuite : WhatsApp, téléphone, email ou prise de rendez-vous en ligne.",
    }),
  component: ContactPage,
});

type FormStatus = "idle" | "sending" | "success" | "error";

function ContactPage() {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      subject: String(fd.get("subject") ?? "").trim() || null,
      message: String(fd.get("message") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
      locale: i18n.resolvedLanguage ?? i18n.language ?? "fr",
    };
    if (payload.name.length < 2) { setErrorMsg(t("contact.formNameMin")); setStatus("error"); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) { setErrorMsg(t("contact.formEmailInvalid")); setStatus("error"); return; }
    if (payload.message.length < 10) { setErrorMsg(t("contact.formMessageMin")); setStatus("error"); return; }

    setStatus("sending");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send-failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg(t("contact.formError"));
    }
  }

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="eyebrow text-gold">{t("contact.eyebrow")}</span>
          <h1 className="mt-4 font-serif text-4xl text-forest md:text-5xl">{t("contact.title")}</h1>
          <p className="mt-4 mx-auto max-w-xl text-sm text-earth/75">{t("contact.subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard icon={MessageCircle} label={t("contact.whatsapp")} value={t("contact.whatsappValue")} href={WHATSAPP_HREF} />
          <ContactCard icon={Phone} label={t("contact.phone")} value={PHONE_DISPLAY} href={PHONE_HREF} />
          <ContactCard icon={Mail} label={t("contact.email")} value={EMAIL} href={`mailto:${EMAIL}`} />
          <ContactCard icon={MapPin} label={t("contact.location")} value={t("contact.locationValue")} />
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl text-forest md:text-3xl">{t("contact.formTitle")}</h2>
            <p className="mt-2 text-sm text-earth/70">{t("contact.formSubtitle")}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate aria-describedby="contact-form-status">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <label className="block">
                <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("contact.formName")}</span>
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  aria-required="true"
                  className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("contact.formEmail")}</span>
                <input
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("contact.formSubject")}</span>
                <input
                  name="subject"
                  type="text"
                  className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("contact.formMessage")}</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  rows={6}
                  aria-required="true"
                  className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </label>

              <div id="contact-form-status" aria-live="polite">
                {status === "error" && errorMsg && (
                  <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorMsg}</p>
                )}
                {status === "success" && (
                  <p className="rounded-md bg-forest/10 px-3 py-2 text-sm text-forest">{t("contact.formSuccess")}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-md bg-forest px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft disabled:opacity-60"
              >
                <Send className="size-4" />
                {status === "sending" ? t("contact.formSending") : t("contact.formSend")}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-forest md:text-3xl">{t("contact.calendarTitle")}</h2>
            <div className="mt-4 overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-gold/20">
              <iframe
                src={CALENDLY_EMBED_URL}
                width="100%"
                height="620"
                frameBorder="0"
                title="Prendre rendez-vous"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {
  const inner = (
    <>
      <Icon className="size-6 text-gold" aria-hidden="true" />
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-forest">{label}</p>
      <p className="mt-2 text-sm text-earth/80">{value}</p>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="flex flex-col items-center rounded-xl bg-cream-warm p-6 text-center ring-1 ring-gold/20 transition-all hover:-translate-y-0.5 hover:ring-gold"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="flex flex-col items-center rounded-xl bg-cream-warm p-6 text-center ring-1 ring-gold/20">
      {inner}
    </div>
  );
}
