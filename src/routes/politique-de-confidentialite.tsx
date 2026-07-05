import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, TBD } from "../components/site/legal-page";
import { SITE_URL, EMAIL } from "../lib/config";
import { getPublicSettings, type PublicSettings } from "../lib/settings.functions";

export const Route = createFileRoute("/politique-de-confidentialite")({
  loader: async () => {
    let settings: PublicSettings = {
      paypal_client_id: "",
      donation_amounts: [],
      legal_editor_name: "",
      legal_editor_status: "",
      legal_editor_siret: "",
      legal_editor_address: "",
      legal_publication_director: "",
    };
    try {
      settings = await getPublicSettings();
    } catch {}
    return { settings };
  },
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — Jabamiah" },
      {
        name: "description",
        content:
          "Politique de confidentialité de Jabamiah : traitements de données personnelles, finalités, durée de conservation, droits RGPD.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Politique de confidentialité — Jabamiah" },
      { property: "og:url", content: `${SITE_URL}/politique-de-confidentialite` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/politique-de-confidentialite` }],
  }),
  component: Privacy,
});

function Privacy() {
  const { settings } = Route.useLoaderData();
  const editor = settings.legal_editor_name.trim()
    ? <>{settings.legal_editor_name}</>
    : <TBD>raison sociale de l'éditeur</TBD>;
  const address = settings.legal_editor_address.trim()
    ? <>{settings.legal_editor_address}</>
    : <TBD>adresse</TBD>;

  return (
    <LegalPage
      eyebrow="RGPD"
      title="Politique de confidentialité"
      lastUpdated="5 juillet 2026"
    >
      <p>
        La présente politique décrit la manière dont Jabamiah collecte, utilise et protège vos
        données personnelles conformément au <strong>Règlement (UE) 2016/679 (RGPD)</strong> et
        à la loi française <strong>Informatique et Libertés</strong> modifiée.
      </p>

      <h2>1. Responsable de traitement</h2>
      <p>
        Le responsable de traitement est {editor}, {address}, contact :{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>


      <h2>2. Données collectées et finalités</h2>

      <h3>2.1 Formulaire de contact</h3>
      <ul>
        <li><strong>Données :</strong> nom, prénom, email, message, adresse IP, langue.</li>
        <li><strong>Finalité :</strong> répondre à votre demande.</li>
        <li><strong>Base légale :</strong> exécution de mesures précontractuelles / intérêt légitime à répondre.</li>
        <li><strong>Conservation :</strong> 3 ans à compter du dernier échange.</li>
      </ul>

      <h3>2.2 Prise de rendez-vous</h3>
      <ul>
        <li><strong>Données :</strong> nom, email, horaire, informations complémentaires transmises via Calendly.</li>
        <li><strong>Finalité :</strong> planification et suivi de la consultation.</li>
        <li><strong>Base légale :</strong> exécution du service demandé.</li>
        <li><strong>Conservation :</strong> 3 ans après la dernière consultation.</li>
      </ul>

      <h3>2.3 Mesure d'audience (Google Analytics)</h3>
      <ul>
        <li><strong>Données :</strong> pages consultées, source de la visite, appareil, IP anonymisée.</li>
        <li><strong>Finalité :</strong> mesurer la fréquentation du site.</li>
        <li><strong>Base légale :</strong> votre consentement (article 82 loi Informatique et Libertés).</li>
        <li><strong>Conservation :</strong> 14 mois maximum.</li>
        <li>
          Aucun cookie de mesure n'est déposé tant que vous n'avez pas cliqué sur « Tout
          accepter ». Vous pouvez retirer votre consentement à tout moment depuis la page{" "}
          <Link to="/cookies">Cookies</Link>.
        </li>
      </ul>

      <h2>3. Destinataires</h2>
      <p>
        Vos données ne sont accessibles qu'aux personnes habilitées de Jabamiah et à ses
        sous-traitants techniques agissant sur instructions documentées :
      </p>
      <ul>
        <li><strong>Cloudflare, Inc.</strong> (États-Unis) — CDN et calcul en périphérie ;</li>
        <li><strong>IONOS SARL</strong> (France) — nom de domaine ;</li>
        <li><strong>Supabase Inc.</strong> — base de données applicative (UE) ;</li>
        <li><strong>Resend</strong> — envoi des emails transactionnels ;</li>
        <li><strong>Calendly</strong> — prise de rendez-vous ;</li>
        <li><strong>Google Ireland Ltd.</strong> — mesure d'audience (uniquement après consentement).</li>
      </ul>
      <p>
        Certains prestataires (Cloudflare, Google) peuvent transférer des données hors UE.
        Ces transferts sont encadrés par les <strong>Clauses Contractuelles Types</strong> de
        la Commission européenne.
      </p>

      <h2>4. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li>droit d'accès, de rectification, d'effacement (« droit à l'oubli ») ;</li>
        <li>droit à la limitation et à la portabilité de vos données ;</li>
        <li>droit d'opposition, y compris au profilage ;</li>
        <li>droit de retirer votre consentement à tout moment ;</li>
        <li>droit de définir des directives relatives au sort de vos données après votre décès.</li>
      </ul>
      <p>
        Pour exercer ces droits, écrivez à <a href={`mailto:${EMAIL}`}>{EMAIL}</a> en joignant
        un justificatif d'identité. Nous répondons sous un délai maximal d'un mois.
      </p>
      <p>
        En cas de désaccord, vous pouvez introduire une réclamation auprès de la{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noreferrer">
          CNIL
        </a>{" "}
        (3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07).
      </p>

      <h2>5. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles adaptées :
        chiffrement TLS, contrôle d'accès, journalisation, sauvegardes, sous-traitants
        certifiés. Aucun système n'étant infaillible, nous nous engageons à notifier la CNIL
        et les personnes concernées en cas de violation présentant un risque, dans les délais
        prévus par le RGPD.
      </p>

      <h2>6. Modifications</h2>
      <p>
        La présente politique peut être mise à jour. La date de dernière révision figure en
        haut de page.
      </p>
    </LegalPage>
  );
}
