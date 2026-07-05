import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { SUPPORTED_LANGUAGES } from "../i18n";
import { SITE_URL } from "../lib/config";

const BASE_URL = SITE_URL;

const STATIC_PATHS = [
  { path: "/", priority: "1.0", changefreq: "weekly" as const },
  { path: "/about", priority: "0.8", changefreq: "monthly" as const },
  { path: "/soins-et-therapies", priority: "0.9", changefreq: "monthly" as const },
  { path: "/plantes-et-remedes", priority: "0.8", changefreq: "monthly" as const },
  { path: "/temoignages", priority: "0.7", changefreq: "monthly" as const },
  { path: "/blog", priority: "0.8", changefreq: "weekly" as const },
  { path: "/contact", priority: "0.7", changefreq: "yearly" as const },
  { path: "/don", priority: "0.7", changefreq: "monthly" as const },
  { path: "/mentions-legales", priority: "0.3", changefreq: "yearly" as const },
  { path: "/politique-de-confidentialite", priority: "0.3", changefreq: "yearly" as const },
  { path: "/cgu", priority: "0.3", changefreq: "yearly" as const },
  { path: "/cookies", priority: "0.3", changefreq: "yearly" as const },
];

const THERAPY_SLUGS = ["energetique", "pensee", "plantes", "harmonisation", "spirituel"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Add therapy detail pages
        const therapyEntries = THERAPY_SLUGS.map((slug) => ({
          path: `/soins-et-therapies/${slug}`,
          priority: "0.7",
          changefreq: "monthly" as const,
        }));

        // Fetch published blog posts
        let postEntries: Array<{ path: string; priority: string; changefreq: "weekly" }> = [];
        try {
          const supabaseUrl = process.env.SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
          if (supabaseUrl && supabaseKey) {
            const sb = createClient(supabaseUrl, supabaseKey, {
              auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
            });
            const { data } = await sb
              .from("posts")
              .select("slug, updated_at")
              .eq("status", "published");
            postEntries = (data ?? []).map((p) => ({
              path: `/blog/${p.slug}`,
              priority: "0.6",
              changefreq: "weekly" as const,
            }));
          }
        } catch (err) {
          console.error("[sitemap] failed to fetch posts", err);
        }

        const entries = [...STATIC_PATHS, ...therapyEntries, ...postEntries];

        const urls = entries.map((e) => {
          const loc = `${BASE_URL}${e.path === "/" ? "" : e.path}`;
          const alternates = SUPPORTED_LANGUAGES.map(
            (l) =>
              `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${loc}"/>`,
          ).join("\n");
          return [
            "  <url>",
            `    <loc>${loc}</loc>`,
            `    <changefreq>${e.changefreq}</changefreq>`,
            `    <priority>${e.priority}</priority>`,
            alternates,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`,
            "  </url>",
          ].join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            // No cache so a domain change (SITE_URL) propagates immediately.
            "Cache-Control": "public, max-age=0, must-revalidate",
          },
        });
      },
    },
  },
});
