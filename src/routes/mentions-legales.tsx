import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "../components/site/page-stub";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [{ title: "Mentions légales — Jabamiah" }],
  }),
  component: () => (
    <PageStub
      eyebrow="Mentions légales"
      title="Mentions légales"
      description="Les mentions légales du site seront publiées prochainement."
    />
  ),
});
