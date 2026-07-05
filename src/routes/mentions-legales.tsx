import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, TBD } from "../components/site/legal-page";
import { SITE_URL, EMAIL, PHONE_DISPLAY } from "../lib/config";
import { getPublicSettings, type PublicSettings } from "../lib/settings.functions";

export const Route = createFileRoute("/mentions-legales")({
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
      { title: "Mentions légales — Jabamiah" },
      {
        name: "description",
        content:
          "Mentions légales du site Jabamiah : éditeur, directeur de la publication, hébergeur et contact.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Mentions légales — Jabamiah" },
      { property: "og:url", content: `${SITE_URL}/mentions-legales` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/mentions-legales` }],
  }),
  component: MentionsLegales,
});

function orTBD(value: string, placeholder: string) {
  return value.trim() ? <>{value}</> : <TBD>{placeholder}</TBD>;
}

function MentionsLegales() {
  const { settings } = Route.useLoaderData();

  return (
    <LegalPage eyebrow="Informations légales" title="Mentions légales" lastUpdated="5 juillet 2026">
      <h2>1. Éditeur du site</h2>
      <p>
        Le site <strong>{SITE_URL.replace(/^https?:\/\//, "")}</strong> est édité par :
      </p>
      <ul>
        <li>
          <strong>Raison sociale / nom :</strong>{" "}
          {orTBD(settings.legal_editor_name, "raison sociale ou nom de l'éditeur")}
        </li>
        <li>
          <strong>Statut juridique :</strong>{" "}
          {orTBD(settings.legal_editor_status, "EI / EIRL / auto-entrepreneur / SASU…")}
        </li>
        <li>
          <strong>SIRET :</strong>{" "}
          {orTBD(settings.legal_editor_siret, "numéro SIRET à 14 chiffres")}
        </li>
        <li>
          <strong>Adresse :</strong>{" "}
          {orTBD(settings.legal_editor_address, "adresse postale complète")}
        </li>
        <li>
          <strong>Téléphone :</strong> {PHONE_DISPLAY}
        </li>
        <li>
          <strong>Email :</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </li>
      </ul>

      <h2>2. Directeur de la publication</h2>
      <p>
        {orTBD(
          settings.legal_publication_director,
          "Nom et prénom du directeur ou de la directrice de la publication",
        )}
        .
      </p>

      <h2>3. Hébergement</h2>
      <p>
        Le site est hébergé sur l'infrastructure de <strong>Cloudflare, Inc.</strong> —
        101 Townsend Street, San Francisco, CA 94107, États-Unis — pour la distribution
        (CDN, calcul en périphérie), avec un nom de domaine géré par <strong>IONOS SARL</strong>{" "}
        — 7 place de la Gare, BP 70109, 57200 Sarreguemines Cedex, France.
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur ce site (textes, images, illustrations, logos,
        vidéos, sons, mise en page, charte graphique) est protégé par le droit d'auteur et
        appartient à l'éditeur, sauf mention contraire. Toute reproduction, représentation,
        modification ou exploitation, totale ou partielle, sans autorisation écrite préalable
        est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et
        suivants du Code de la propriété intellectuelle.
      </p>

      <h2>5. Nature des services proposés</h2>
      <p>
        Jabamiah propose un accompagnement énergétique et spirituel à titre de{" "}
        <strong>praticien de bien-être</strong>. Les prestations décrites sur ce site ne
        constituent en aucun cas un acte médical ni un diagnostic. Elles ne se substituent
        pas à un traitement médical ou à l'avis d'un professionnel de santé. En cas de
        problème de santé, consultez un médecin.
      </p>

      <h2>6. Liens hypertextes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun
        contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
      </p>

      <h2>7. Contact</h2>
      <p>
        Pour toute question relative au site, vous pouvez nous écrire à{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
