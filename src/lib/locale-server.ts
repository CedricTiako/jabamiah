import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestHeader } from "@tanstack/start-server-core";

const SUPPORTED = ["fr", "en", "es", "de", "it", "nl", "pl", "pt"] as const;
export type Locale = (typeof SUPPORTED)[number];

function detectLocale(): Locale {
  try {
    const cookie = getCookie("i18nextLng");
    if (cookie) {
      const lang = cookie.slice(0, 2).toLowerCase();
      if ((SUPPORTED as readonly string[]).includes(lang)) return lang as Locale;
    }
    const accept = getRequestHeader("accept-language") ?? "";
    for (const entry of accept.split(",")) {
      const lang = entry.split(";")[0].trim().slice(0, 2).toLowerCase();
      if ((SUPPORTED as readonly string[]).includes(lang)) return lang as Locale;
    }
  } catch {
    // Outside request context (client-side navigation)
  }
  return "fr";
}

export const getServerLocale = createServerFn().handler(detectLocale);

export const LOCALE_TO_OG: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
  es: "es_ES",
  de: "de_DE",
  it: "it_IT",
  nl: "nl_NL",
  pl: "pl_PL",
  pt: "pt_PT",
};
