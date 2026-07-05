import { SUPPORTED_LANGUAGES } from "../i18n";
import { SITE_URL } from "./config";

export { SITE_URL };
export const DEFAULT_LOCALE = "fr" as const;

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}

/**
 * Build hreflang <link rel="alternate"> entries for a given route path.
 * Since the app keeps the same URL across languages (no /en/, /de/ prefix),
 * we still emit hreflang tags so search engines know the page is multilingual.
 */
export function buildHreflangLinks(path: string): Array<{ rel: string; hrefLang: string; href: string }> {
  const href = absoluteUrl(path);
  const links: Array<{ rel: string; hrefLang: string; href: string }> = SUPPORTED_LANGUAGES.map(
    (lang) => ({ rel: "alternate", hrefLang: lang.code, href }),
  );
  links.push({ rel: "alternate", hrefLang: "x-default", href });
  return links;
}

interface BuildHeadInput {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export function buildSeoHead({ path, title, description, image, type = "website" }: BuildHeadInput) {
  const url = absoluteUrl(path);
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: "Jabamiah" },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: title },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];
  const links = [
    { rel: "canonical", href: url },
    ...buildHreflangLinks(path),
  ];
  return { meta, links };
}
