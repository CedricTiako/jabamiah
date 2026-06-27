import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "../components/site/page-stub";

export const Route = createFileRoute("/temoignages")({
  head: () => ({
    meta: [
      { title: "Témoignages — Jabamiah" },
      {
        name: "description",
        content: "Découvrez les témoignages de celles et ceux qui ont été accompagnés.",
      },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Témoignages"
      title="Ils ont retrouvé leur lumière"
      description="Cette page recueillera bientôt les témoignages des personnes accompagnées."
    />
  ),
});
