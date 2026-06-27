import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "../components/site/page-stub";

export const Route = createFileRoute("/soins-et-therapies")({
  head: () => ({
    meta: [
      { title: "Soins & Thérapies — Jabamiah" },
      {
        name: "description",
        content:
          "Découvrez les soins énergétiques, la guérison par la pensée, l'harmonisation globale et le développement spirituel proposés par Jabamiah.",
      },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Soins & Thérapies"
      title="Des soins personnalisés pour chaque être"
      description="Cette section détaillera les soins énergétiques, la guérison par la pensée, l'harmonisation globale et le développement spirituel."
    />
  ),
});
