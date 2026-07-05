## Problème

Actuellement, l'URL du site est **codée en dur** à plusieurs endroits du code source :

- `src/routes/sitemap[.]xml.ts` → `BASE_URL = "https://jabamiah.smartsolution-it.com"`
- `src/lib/seo.ts` → `SITE_URL = "https://jabamiah.smartsolution-it.com"`
- `public/robots.txt` → `Sitemap: https://jabamiah.smartsolution-it.com/sitemap.xml`
- `public/sitemap.xml` (fichier statique legacy qui traîne)
- `src/routes/__root.tsx` → plusieurs `og:image`, JSON-LD, `og:url` en dur

Quand le client déploie sur `https://jabamiah.eu/`, tout continue de pointer vers `smartsolution-it.com` → mauvais SEO, mauvaises previews sociales, sitemap invalide.

## Objectif

Rendre l'URL du site **configurable via une seule variable d'environnement**, avec `https://jabamiah.eu` comme valeur par défaut de production, pour que le client puisse déployer sans toucher au code.

## Plan

### 1. Centraliser l'URL dans une seule constante

Créer/adapter `src/lib/config.ts` (déjà présent) pour exposer :

```ts
export const SITE_URL =
  process.env.SITE_URL              // serveur (sitemap, SSR head)
  ?? import.meta.env.VITE_SITE_URL  // client
  ?? "https://jabamiah.eu";         // défaut production
```

Toutes les autres constantes (`BASE_URL` dans sitemap, `SITE_URL` dans seo.ts, URLs en dur dans `__root.tsx`) importent depuis là.

### 2. Ajouter la variable d'environnement

- Ajouter `SITE_URL=https://jabamiah.eu` et `VITE_SITE_URL=https://jabamiah.eu` dans `.env` (defaults de prod).
- Documenter dans un `README.md` (ou section deploy) : « pour changer de domaine, modifier `SITE_URL` / `VITE_SITE_URL` dans `.env` avant `bun run build` ».

### 3. Remplacer les URLs en dur

- `src/routes/sitemap[.]xml.ts` → utiliser `SITE_URL` depuis `config.ts`
- `src/lib/seo.ts` → utiliser `SITE_URL` depuis `config.ts` (au lieu de la constante locale)
- `src/routes/__root.tsx` → remplacer les `https://jabamiah.smartsolution-it.com/...` codés en dur (og:image, JSON-LD, `SITE`) par `${SITE_URL}/...`
- `public/robots.txt` → remplacer par `Sitemap: https://jabamiah.eu/sitemap.xml` (statique, mais avec la bonne valeur par défaut)

### 4. Supprimer le sitemap statique legacy

`public/sitemap.xml` est un vestige qui ne se met plus à jour. Le vrai sitemap dynamique est `src/routes/sitemap[.]xml.ts`. À supprimer pour éviter la confusion.

### 5. Vérification

- `curl http://localhost:8080/sitemap.xml` en local doit afficher des `<loc>https://jabamiah.eu/...</loc>` (si `.env` a la bonne valeur).
- Les balises `<link rel="canonical">`, `og:url`, `og:image` doivent toutes utiliser `jabamiah.eu`.

## Instructions pour le client (à documenter)

Pour déployer sur un autre domaine, il suffit de modifier **deux lignes** dans `.env` :

```
SITE_URL=https://jabamiah.eu
VITE_SITE_URL=https://jabamiah.eu
```

puis `bun run build`. Aucun autre fichier à toucher.

## Hors périmètre

- Configuration DNS / hébergement chez le client (dépend de son provider).
- Mise en place de redirections 301 depuis l'ancien domaine (à faire côté serveur du client).
