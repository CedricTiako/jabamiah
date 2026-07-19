import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LegalPage } from "../components/site/legal-page";
import { SITE_URL, EMAIL } from "../lib/config";
import {
  clearConsent,
  CONSENT_EVENT,
  getConsent,
  setConsent,
  type ConsentValue,
} from "../lib/analytics";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Politique cookies — Jabamiah" },
      {
        name: "description",
        content:
          "Politique de gestion des cookies du site Jabamiah : liste, finalités, durée et gestion de votre consentement.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Politique cookies — Jabamiah" },
      { property: "og:url", content: `${SITE_URL}/cookies` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cookies` }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const [choice, setChoice] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setChoice(getConsent());
    const onChange = (e: Event) => setChoice((e as CustomEvent).detail as ConsentValue | null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const statusLabel =
    choice === "accepted"
      ? "Vous avez accepté les cookies de mesure d'audience."
      : choice === "rejected"
        ? "Vous avez refusé les cookies de mesure d'audience."
        : "Vous n'avez pas encore fait de choix.";

  return (
    <LegalPage
      eyebrow="Cookies"
      title="Politique de gestion des cookies"
      lastUpdated="5 juillet 2026"
    >
      <h2>1. Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, mobile,
        tablette) lors de la consultation d'un site. Il permet notamment de reconnaître votre
        navigateur, de mémoriser des préférences ou de mesurer l'audience.
      </p>

      <h2>2. Cookies déposés sur ce site</h2>

      <h3>Cookies strictement nécessaires (sans consentement)</h3>
      <ul>
        <li>
          <strong>jabamiah_consent_v1</strong> — mémorise votre choix de consentement. Durée : 13
          mois. Sans dépôt de ce cookie, la bannière réapparaîtrait à chaque visite.
        </li>
        <li>
          <strong>i18nextLng</strong> — mémorise votre langue préférée. Durée : 13 mois.
        </li>
      </ul>

      <h3>Cookies de mesure d'audience (soumis à consentement)</h3>
      <ul>
        <li>
          <strong>_ga, _ga_&lt;ID&gt;</strong> — Google Analytics 4, mesure d'audience avec IP
          anonymisée. Durée : 13 mois. Émetteur : Google Ireland Ltd.
        </li>
      </ul>
      <p>
        Ces cookies ne sont déposés qu'après votre consentement explicite. Aucun cookie publicitaire
        n'est utilisé sur ce site.
      </p>

      <h2>3. Gérer votre consentement</h2>
      <p>
        <strong>Statut actuel :</strong> {statusLabel}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 not-prose">
        <button
          type="button"
          onClick={() => setConsent("accepted")}
          className="rounded-md bg-forest px-4 py-2 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
        >
          Accepter la mesure d'audience
        </button>
        <button
          type="button"
          onClick={() => setConsent("rejected")}
          className="rounded-md border border-forest/30 px-4 py-2 text-xs uppercase tracking-[0.18em] text-forest hover:bg-cream-warm"
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => clearConsent()}
          className="rounded-md px-4 py-2 text-xs uppercase tracking-[0.18em] text-forest/70 hover:text-forest"
        >
          Réinitialiser
        </button>
      </div>

      <h2>4. Paramétrer votre navigateur</h2>
      <p>
        Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les cookies :
      </p>
      <ul>
        <li>
          <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">
            Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur"
            target="_blank"
            rel="noreferrer"
          >
            Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noreferrer"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/fr-fr/microsoft-edge"
            target="_blank"
            rel="noreferrer"
          >
            Edge
          </a>
        </li>
      </ul>
      <p>
        Bloquer certains cookies peut altérer le fonctionnement de certaines fonctionnalités du
        Site.
      </p>

      <h2>5. En savoir plus</h2>
      <p>
        Consultez notre <Link to="/politique-de-confidentialite">Politique de confidentialité</Link>{" "}
        pour connaître l'ensemble des traitements de données personnelles, ou écrivez-nous à{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
