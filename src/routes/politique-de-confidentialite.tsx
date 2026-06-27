import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "../components/site/page-stub";

export const Route = createFileRoute("/politique-de-confidentialite")({
  head: () => ({
    meta: [{ title: "Politique de confidentialité — Jabamiah" }],
  }),
  component: () => (
    <PageStub
      eyebrow="Confidentialité"
      title="Politique de confidentialité"
      description="La politique de confidentialité du site sera publiée prochainement."
    />
  ),
});
