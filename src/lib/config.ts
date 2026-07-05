/**
 * Public URL of the deployed site. Used for canonical links, sitemap,
 * Open Graph / Twitter meta, JSON-LD, etc.
 *
 * To deploy on a different domain, set `SITE_URL` (server) and
 * `VITE_SITE_URL` (client) in `.env` before running `bun run build`.
 * No other file needs to be edited.
 */
export const SITE_URL: string =
  (typeof process !== "undefined" && process.env?.SITE_URL) ||
  (typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string> }).env?.VITE_SITE_URL) ||
  "https://jabamiah.eu";

export const CALENDLY_URL = "https://calendly.com/eirl-omont/60min";
export const CALENDLY_EMBED_URL =
  `${CALENDLY_URL}?embed_domain=jabamiah.eu&embed_type=Inline&hide_gdpr_banner=1&background_color=f5f0e6&text_color=2c3a24&primary_color=c4a661`;

export const PHONE_DISPLAY = "07 45 15 54 51";
export const PHONE_HREF = "tel:+33745155451";
export const WHATSAPP_HREF = "https://wa.me/33745155451";
export const EMAIL = "contact@jabamiah.eu";
