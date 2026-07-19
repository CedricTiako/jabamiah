import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "../components/site/legal-page";
import { SITE_URL, EMAIL } from "../lib/config";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions générales d'utilisation — Jabamiah" },
      {
        name: "description",
        content:
          "Conditions générales d'utilisation du site Jabamiah : accès, propriété intellectuelle, responsabilité, droit applicable.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Conditions générales d'utilisation — Jabamiah" },
      { property: "og:url", content: `${SITE_URL}/cgu` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cgu` }],
  }),
  component: CGU,
});

function CGU() {
  return (
    <LegalPage
      eyebrow="Utilisation du site"
      title="Conditions générales d'utilisation"
      lastUpdated="5 juillet 2026"
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et
        l'utilisation du site <strong>{SITE_URL.replace(/^https?:\/\//, "")}</strong> (le « Site »).
        En accédant au Site, vous acceptez sans réserve les présentes CGU.
      </p>

      <h2>2. Accès au site</h2>
      <p>
        Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Les
        frais de connexion sont à la charge exclusive de l'utilisateur. L'éditeur se réserve le
        droit de suspendre l'accès pour des raisons de maintenance ou de mise à jour, sans que cela
        ouvre droit à indemnisation.
      </p>

      <h2>3. Services proposés</h2>
      <p>
        Le Site présente les activités de bien-être et d'accompagnement énergétique de Jabamiah. Les
        consultations sont proposées à titre gratuit sur rendez-vous et constituent un
        accompagnement de <strong>confort et de bien-être</strong>. Elles ne constituent pas un acte
        médical, ne posent aucun diagnostic et ne se substituent pas à une consultation ou à un
        traitement médical. En cas de doute sur votre santé, consultez un professionnel de santé
        qualifié.
      </p>

      <h2>4. Comportement de l'utilisateur</h2>
      <p>L'utilisateur s'engage à :</p>
      <ul>
        <li>utiliser le Site conformément à sa destination et aux lois en vigueur ;</li>
        <li>ne pas tenter d'accéder frauduleusement au Site ou à ses systèmes ;</li>
        <li>ne pas diffuser de contenu injurieux, diffamatoire, haineux ou illicite ;</li>
        <li>fournir des informations exactes lorsqu'il remplit un formulaire.</li>
      </ul>

      <h2>5. Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments du Site (textes, images, logos, marques, code source, mise en page)
        est protégé par le droit d'auteur et le droit des marques. Toute reproduction ou
        représentation, totale ou partielle, sans autorisation écrite préalable, est strictement
        interdite.
      </p>

      <h2>6. Responsabilité</h2>
      <p>
        L'éditeur s'efforce d'assurer l'exactitude des informations diffusées sur le Site, sans
        toutefois pouvoir en garantir l'exhaustivité ou l'absence d'erreur. L'éditeur ne saurait
        être tenu responsable :
      </p>
      <ul>
        <li>de toute interruption ou indisponibilité du Site ;</li>
        <li>de tout dommage direct ou indirect résultant de l'utilisation du Site ;</li>
        <li>du contenu des sites tiers accessibles depuis les liens hypertextes.</li>
      </ul>

      <h2>7. Données personnelles et cookies</h2>
      <p>
        Le traitement de vos données personnelles est décrit dans notre{" "}
        <a href="/politique-de-confidentialite">Politique de confidentialité</a>. La gestion des
        cookies est détaillée dans notre <a href="/cookies">Politique cookies</a>.
      </p>

      <h2>8. Modification des CGU</h2>
      <p>
        Les présentes CGU peuvent être modifiées à tout moment. La version en vigueur est celle
        publiée sur le Site à la date de consultation.
      </p>

      <h2>9. Droit applicable et juridiction</h2>
      <p>
        Les présentes CGU sont soumises au <strong>droit français</strong>. À défaut de résolution
        amiable, tout litige sera soumis aux tribunaux français compétents.
      </p>

      <h2>10. Contact</h2>
      <p>
        Toute question relative aux présentes CGU peut être adressée à{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
