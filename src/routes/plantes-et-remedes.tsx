import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "../components/site/page-stub";

export const Route = createFileRoute("/plantes-et-remedes")({
  head: () => ({
    meta: [
      { title: "Plantes & Remèdes naturels — Jabamiah" },
      {
        name: "description",
        content:
          "La sagesse des plantes médicinales et des remèdes naturels au service de votre bien-être.",
      },
    ],
  }),
  component: () => (
    <PageStub
      eyebrow="Plantes & Remèdes"
      title="La sagesse de la nature au service de votre santé"
      description="Présentation des plantes médicinales et des remèdes naturels utilisés en accompagnement."
    />
  ),
});
