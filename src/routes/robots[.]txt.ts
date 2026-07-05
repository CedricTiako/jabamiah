import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "../lib/config";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          "User-agent: *",
          "Allow: /",
          "",
          "# Ne pas indexer l'espace admin",
          "Disallow: /admin",
          "",
          `Sitemap: ${SITE_URL}/sitemap.xml`,
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            // No cache so a domain change (SITE_URL) propagates immediately.
            "Cache-Control": "public, max-age=0, must-revalidate",
          },
        });
      },
    },
  },
});
