import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";
import {
  bootstrapAnalytics,
  CONSENT_EVENT,
  getConsent,
  setConsent,
  type ConsentValue,
} from "../../lib/analytics";

export function CookieConsent() {
  const [choice, setChoice] = useState<ConsentValue | null | "loading">("loading");

  useEffect(() => {
    setChoice(getConsent());
    bootstrapAnalytics();
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as ConsentValue | null;
      setChoice(detail);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (choice === "loading" || choice !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border border-gold/30 bg-cream shadow-2xl md:inset-x-6 md:bottom-6"
    >
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:gap-6 md:p-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
          <Cookie className="size-5" aria-hidden="true" />
        </div>
        <div className="flex-1 text-sm text-earth/80">
          <p className="font-serif text-lg text-forest">Votre vie privée</p>
          <p className="mt-1 leading-relaxed">
            Nous utilisons Google Analytics pour mesurer l'audience du site de manière anonyme. Ces
            cookies ne sont déposés qu'avec votre accord. Vous pouvez modifier votre choix à tout
            moment depuis la page{" "}
            <Link to="/cookies" className="underline hover:text-forest">
              Cookies
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setConsent("accepted")}
              className="rounded-md bg-forest px-4 py-2 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
            >
              Tout accepter
            </button>
            <button
              type="button"
              onClick={() => setConsent("rejected")}
              className="rounded-md border border-forest/30 px-4 py-2 text-xs uppercase tracking-[0.18em] text-forest hover:bg-cream-warm"
            >
              Tout refuser
            </button>
            <Link
              to="/cookies"
              className="rounded-md px-4 py-2 text-xs uppercase tracking-[0.18em] text-forest/70 hover:text-forest"
            >
              Personnaliser
            </Link>
          </div>
        </div>
        <button
          type="button"
          aria-label="Fermer (refuser les cookies)"
          onClick={() => setConsent("rejected")}
          className="absolute right-3 top-3 rounded-full p-1 text-earth/50 hover:bg-forest/5 hover:text-forest md:static"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
