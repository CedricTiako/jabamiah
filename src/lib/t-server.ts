import { fr } from "../i18n/locales/fr";
import { en } from "../i18n/locales/en";
import { es } from "../i18n/locales/es";
import { de } from "../i18n/locales/de";
import { it } from "../i18n/locales/it";
import { nl } from "../i18n/locales/nl";
import { pl } from "../i18n/locales/pl";
import { pt } from "../i18n/locales/pt";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resources: Record<string, { translation: Record<string, any> }> = {
  fr, en, es, de, it, nl, pl, pt,
};

export function tServer(locale: string, key: string): string {
  const bundle = (resources[locale] ?? resources.fr).translation;
  const value = key.split(".").reduce<unknown>((acc, k) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[k];
  }, bundle);
  return typeof value === "string" ? value : key;
}
