#!/usr/bin/env node
/**
 * Prebuild guard: ensures SITE_URL and VITE_SITE_URL are set, valid https URLs,
 * and identical. Prevents shipping a build with broken canonical / og / sitemap
 * links when the client forgets to configure the domain.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  const text = readFileSync(path, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const dotenv = loadDotEnv(resolve(process.cwd(), ".env"));
const SITE_URL = process.env.SITE_URL ?? dotenv.SITE_URL;
const VITE_SITE_URL = process.env.VITE_SITE_URL ?? dotenv.VITE_SITE_URL;

const errors = [];

function validate(name, value) {
  if (!value) {
    errors.push(`${name} est manquant. Ajoutez-le dans .env avant le build.`);
    return null;
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    errors.push(`${name} n'est pas une URL valide: "${value}"`);
    return null;
  }
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    errors.push(`${name} doit utiliser https:// (reçu: "${value}")`);
  }
  if (value.endsWith("/")) {
    errors.push(`${name} ne doit pas se terminer par "/" (reçu: "${value}")`);
  }
  return value;
}

const a = validate("SITE_URL", SITE_URL);
const b = validate("VITE_SITE_URL", VITE_SITE_URL);

if (a && b && a !== b) {
  errors.push(
    `SITE_URL et VITE_SITE_URL doivent être identiques.\n  SITE_URL      = "${a}"\n  VITE_SITE_URL = "${b}"`,
  );
}

if (errors.length > 0) {
  console.error("\n❌ Configuration du domaine invalide:\n");
  for (const e of errors) console.error("  • " + e);
  console.error(
    "\nCorrigez ces deux lignes dans .env puis relancez le build :\n" +
      '  SITE_URL="https://votre-domaine.tld"\n' +
      '  VITE_SITE_URL="https://votre-domaine.tld"\n',
  );
  process.exit(1);
}

console.log(`✓ SITE_URL / VITE_SITE_URL OK — ${a}`);
