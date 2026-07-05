// Google Analytics loader — gated on user consent (CNIL / RGPD compliant).
// GA MUST NOT be loaded before the user has explicitly consented.

const GA_ID = "G-2SXQ3YJG2G";
export const CONSENT_KEY = "jabamiah_consent_v1";
export const CONSENT_EVENT = "jabamiah:consent-change";

export type ConsentValue = "accepted" | "rejected";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __jabamiah_ga_loaded?: boolean;
  }
}

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "accepted" || v === "rejected" ? v : null;
}

export function setConsent(v: ConsentValue): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, v);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: v }));
  if (v === "accepted") {
    loadGoogleAnalytics();
  } else {
    clearGoogleAnalyticsCookies();
  }
}

export function clearConsent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
  clearGoogleAnalyticsCookies();
}

export function loadGoogleAnalytics(): void {
  if (typeof window === "undefined") return;
  if (window.__jabamiah_ga_loaded) return;
  window.__jabamiah_ga_loaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag as typeof window.gtag;
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
}

function clearGoogleAnalyticsCookies(): void {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const domains = [host, `.${host}`, host.replace(/^www\./, ""), `.${host.replace(/^www\./, "")}`];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0]?.trim();
    if (!name) return;
    if (name.startsWith("_ga") || name === "_gid" || name === "_gat") {
      domains.forEach((d) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
      });
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

export function bootstrapAnalytics(): void {
  if (getConsent() === "accepted") loadGoogleAnalytics();
}
