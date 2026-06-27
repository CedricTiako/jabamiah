import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "../components/site/page-stub";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Jabamiah" },
      {
        name: "description",
        content: "Articles, réflexions et guidances autour de la médecine parallèle.",
      },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Blog"
      title="Réflexions, partages et guidances"
      description="Les articles seront bientôt publiés dans cet espace."
    />
  ),
});
