#!/usr/bin/env node
/**
 * Export complet des données Supabase (Lovable Cloud) vers des fichiers SQL
 * prêts à être réimportés dans un nouveau projet Supabase.
 *
 * Utilisation :
 *   PGHOST=... PGPORT=... PGUSER=... PGPASSWORD=... PGDATABASE=... \
 *     node scripts/export-supabase.mjs
 *
 * Ou, si vous avez déjà une DATABASE_URL (Session pooler recommandé) :
 *   DATABASE_URL="postgres://postgres.xxx:pwd@host:5432/postgres" \
 *     node scripts/export-supabase.mjs
 *
 * Produit dans ./supabase-export/ :
 *   - 01_schema.sql       (structure : tables, enums, fonctions, policies, triggers)
 *   - 02_data.sql         (INSERT ... des tables publiques, dans l'ordre des FK)
 *   - 03_storage.sql      (métadonnées des buckets/objets storage — fichiers à copier séparément)
 *   - 04_auth_users.csv   (liste des utilisateurs auth.users pour recréation manuelle)
 *   - README.md           (procédure de réimport)
 */

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve(process.cwd(), "supabase-export");
mkdirSync(OUT_DIR, { recursive: true });

// --- 1. Vérif env ---------------------------------------------------------
const hasPgVars = process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE;
const hasUrl = !!process.env.DATABASE_URL;
if (!hasPgVars && !hasUrl) {
  console.error("❌ Fournissez soit DATABASE_URL, soit PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE.");
  process.exit(1);
}

const PG_BASE = hasUrl ? `"${process.env.DATABASE_URL}"` : "";
function psql(sql, extraArgs = "") {
  const cmd = hasUrl
    ? `psql ${PG_BASE} -Atc ${JSON.stringify(sql)} ${extraArgs}`
    : `psql -Atc ${JSON.stringify(sql)} ${extraArgs}`;
  return execSync(cmd, { encoding: "utf8", maxBuffer: 1024 * 1024 * 256 });
}
function pgDump(args) {
  const conn = hasUrl ? PG_BASE : "";
  return execSync(`pg_dump ${conn} ${args}`, { encoding: "utf8", maxBuffer: 1024 * 1024 * 512 });
}

// Vérifie que pg_dump est dispo
try {
  execSync("pg_dump --version", { stdio: "ignore" });
} catch {
  console.error("❌ pg_dump introuvable. Installe postgresql-client (v15+ recommandé).");
  process.exit(1);
}

console.log("→ Connexion OK, export en cours…");

// --- 2. Schéma public (structure) ----------------------------------------
console.log("→ Export du schéma public (structure)…");
const schemaSql = pgDump(
  "--schema-only --schema=public --no-owner --no-privileges --no-comments",
);
writeFileSync(resolve(OUT_DIR, "01_schema.sql"), schemaSql);

// --- 3. Données du schéma public -----------------------------------------
console.log("→ Export des données publiques…");
const dataSql = pgDump(
  "--data-only --schema=public --no-owner --column-inserts --disable-triggers",
);
writeFileSync(resolve(OUT_DIR, "02_data.sql"), dataSql);

// --- 4. Métadonnées Storage ----------------------------------------------
console.log("→ Export des métadonnées storage (buckets + objets)…");
try {
  const storageSql = pgDump(
    "--data-only --schema=storage -t storage.buckets -t storage.objects --column-inserts --no-owner",
  );
  writeFileSync(resolve(OUT_DIR, "03_storage.sql"), storageSql);
} catch (e) {
  writeFileSync(
    resolve(OUT_DIR, "03_storage.sql"),
    `-- Export storage échoué : ${e.message}\n-- Recréez les buckets manuellement.\n`,
  );
}

// --- 5. Users auth (liste seulement, pour référence) ----------------------
console.log("→ Export de la liste auth.users (CSV)…");
try {
  const usersCsv = hasUrl
    ? execSync(
        `psql ${PG_BASE} -c "\\COPY (SELECT id, email, created_at, last_sign_in_at, raw_user_meta_data FROM auth.users ORDER BY created_at) TO STDOUT WITH CSV HEADER"`,
        { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 },
      )
    : execSync(
        `psql -c "\\COPY (SELECT id, email, created_at, last_sign_in_at, raw_user_meta_data FROM auth.users ORDER BY created_at) TO STDOUT WITH CSV HEADER"`,
        { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 },
      );
  writeFileSync(resolve(OUT_DIR, "04_auth_users.csv"), usersCsv);
} catch (e) {
  writeFileSync(resolve(OUT_DIR, "04_auth_users.csv"), `# Export auth.users échoué : ${e.message}\n`);
}

// --- 6. README -----------------------------------------------------------
const readme = `# Export Supabase — Jabamiah

Généré le ${new Date().toISOString()}.

## Contenu

| Fichier | Description |
|---|---|
| \`01_schema.sql\` | Structure du schéma \`public\` (tables, enums, fonctions, policies RLS, triggers) |
| \`02_data.sql\` | Toutes les lignes des tables publiques (INSERT explicites, triggers désactivés) |
| \`03_storage.sql\` | Métadonnées des buckets et objets Storage (⚠ les fichiers binaires ne sont PAS inclus) |
| \`04_auth_users.csv\` | Liste des comptes utilisateurs pour référence |

## Réimport dans un nouveau projet Supabase

### 1. Récupérez la connection string
Dans le nouveau projet : **Project Settings → Database → Connection string → URI** (Session pooler).

\`\`\`bash
export TARGET_URL="postgres://postgres.xxx:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
\`\`\`

### 2. Importez le schéma
\`\`\`bash
psql "$TARGET_URL" -f 01_schema.sql
\`\`\`
> Certaines erreurs \`already exists\` sur les extensions/fonctions Supabase de base sont normales et peuvent être ignorées.

### 3. Importez les données
\`\`\`bash
psql "$TARGET_URL" -f 02_data.sql
\`\`\`

### 4. (Optionnel) Métadonnées Storage
\`\`\`bash
psql "$TARGET_URL" -f 03_storage.sql
\`\`\`
Puis re-uploadez les fichiers binaires dans les buckets correspondants (script séparé nécessaire — voir plus bas).

### 5. Recréez les utilisateurs
Supabase Auth ne permet **pas** l'import direct de \`auth.users\` (mots de passe hachés propriétaires).
Options :
- Inviter à nouveau chaque utilisateur via **Authentication → Users → Invite** ;
- Ou utiliser l'Auth Admin API avec \`generateLink({ type: 'invite' })\` en boucle sur le CSV ;
- Ou activer les mêmes providers OAuth (Google, etc.) et les utilisateurs se recréeront à la 1ʳᵉ connexion.

Les \`user_id\` dans \`02_data.sql\` référencent les anciens UUIDs — après création des nouveaux users, il faut soit **réutiliser les mêmes UUIDs** (possible via Admin API en passant \`id\`), soit mapper les anciens vers les nouveaux avant l'import des données.

### 6. Reconfigurez les secrets côté nouveau projet
- \`RESEND_API_KEY\`
- \`SUPABASE_SERVICE_ROLE_KEY\` (auto)
- Providers OAuth (Google client id/secret)
- Buckets Storage : recréer \`blog-covers\` (privé)

### 7. Mettez à jour le \`.env\` de l'app
\`\`\`
SUPABASE_URL=https://<new-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_URL=https://<new-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
\`\`\`

## Copier les fichiers Storage

Non inclus automatiquement. Utilisez le CLI Supabase :
\`\`\`bash
# Depuis l'ancien projet
supabase storage download --project-ref OLD_REF blog-covers ./storage-backup/blog-covers

# Vers le nouveau
supabase storage upload --project-ref NEW_REF blog-covers ./storage-backup/blog-covers --recursive
\`\`\`
`;

writeFileSync(resolve(OUT_DIR, "README.md"), readme);

console.log(`✅ Export terminé dans ${OUT_DIR}`);
console.log("   Consultez README.md pour la procédure de réimport.");
