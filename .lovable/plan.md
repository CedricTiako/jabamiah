## Objectif

Finaliser la refonte de jabamiah.smartsolution-it.com avec : i18n complet sur les pages principales, SEO multilingue (sitemap + hreflang + og:image), blog dynamique avec back-office admin, et formulaire de contact opérationnel via Resend.

---

## 1. Internationalisation des pages restantes

Extraire tout le texte visible de `index.tsx` (Accueil), `about.tsx` (À propos) et `contact.tsx` (Contact) vers les fichiers de traduction i18next, dans les 8 langues (FR, EN, ES, DE, IT, NL, PL, PT).

- Découper les contenus en namespaces : `home`, `about`, `contact`
- Réutiliser les clés communes (CTA, labels formulaire) depuis `common`
- Traductions FR rédigées, puis adaptées pour les 7 autres langues (ton spirituel/wellness préservé)
- Vérifier les `<title>` et `<meta>` par route (voir section SEO)

## 2. SEO multilingue complet

**Sitemap dynamique** (`src/routes/sitemap[.]xml.ts`) :
- Une entrée par route × par langue (8 versions)
- Inclut routes statiques + routes dynamiques (soins, plantes, articles blog)
- `<xhtml:link rel="alternate" hreflang="...">` pour chaque variante + `x-default` (FR)

**Hreflang par route** :
- Helper `buildHreflangLinks(path)` qui génère les `<link rel="alternate">` pour les 8 langues
- Intégré dans le `head()` de chaque `createFileRoute`
- Canonical auto-pointé sur la version de la langue active

**og:image par route** :
- Image hero existante réutilisée comme og:image pour Accueil, À propos, Soins, Plantes, Témoignages, Contact
- Pour les articles de blog : image de couverture de l'article
- `og:title`, `og:description`, `twitter:card` par route, traduits via i18n côté serveur (loader)

**robots.txt** mis à jour avec la directive `Sitemap:`.

## 3. Blog dynamique avec back-office admin

**Schéma base (Lovable Cloud)** :
- `posts` : id, slug, status (draft/published), cover_image_url, author_id, published_at, created_at, updated_at
- `post_translations` : id, post_id, locale, title, excerpt, body (markdown/HTML), meta_description
- `app_role` enum + `user_roles` + fonction `has_role()` (pattern sécurisé)
- RLS : lecture publique des `published`, écriture réservée aux `admin`
- GRANTs explicites pour `anon` (SELECT published) / `authenticated` / `service_role`

**Routes publiques** :
- `/blog` : liste paginée des articles publiés (filtrée par locale active, fallback FR)
- `/blog/$slug` : article détail avec SEO complet (og:image = cover, JSON-LD Article, hreflang vers les autres locales)

**Back-office admin** (sous `_authenticated/admin/`) :
- Garde de route via `has_role('admin')`
- `/admin/posts` : liste avec statut, recherche, création
- `/admin/posts/$id` : éditeur multilingue avec onglets par langue, upload de cover image (Supabase Storage), preview, toggle publish/unpublish
- Éditeur de contenu : zone markdown simple (textarea + preview) — pas de WYSIWYG complexe

**Server functions** (`src/lib/posts.functions.ts`) :
- `listPublishedPosts({ locale })`, `getPostBySlug({ slug, locale })` — publics, via client publishable
- `adminListPosts`, `adminUpsertPost`, `adminPublishPost`, `adminDeletePost` — protégés par `requireSupabaseAuth` + check `has_role('admin')`

## 4. Formulaire de contact opérationnel (Resend)

**Connecteur Resend** :
- Vérifier les connexions existantes ; sinon brancher via le connecteur standard Resend
- Sender : domaine `jabamiah.smartsolution-it.com` (à vérifier côté Resend) ou `onboarding@resend.dev` en fallback

**Server route publique** (`src/routes/api/public/contact.ts`) :
- POST : validation Zod (nom, email, sujet, message, honeypot anti-bot, rate-limit léger par IP en mémoire)
- Envoi via gateway Resend → 1 email à l'adresse de Jabamiah + 1 accusé réception au visiteur
- Templates HTML inline, aux couleurs de la marque (vert forêt / or / crème)
- Réponses i18n côté client (succès / erreur)

**Côté client** :
- `contact.tsx` : passage en `react-hook-form` + `zodResolver`, états loading/success/error traduits
- Stockage optionnel du message en base (`contact_messages`) pour traçabilité admin

---

## Détails techniques

- **i18n SSR** : charger la locale active au niveau du `__root.tsx` loader pour que les `head()` aient accès aux traductions côté serveur (sinon les meta tags ne sont pas traduits dans le HTML initial → mauvais pour SEO)
- **Routes localisées** : on garde les mêmes chemins (`/blog`, `/soins-et-therapies`) avec contenu traduit selon `?lang=` ou cookie ; pas de préfixe `/en/`, `/de/` (plus simple, hreflang gère l'indexation)
- **Storage** : bucket `blog-covers` public pour les images d'articles
- **Sécurité** : roles dans table dédiée (jamais sur profile), fonction `has_role` en SECURITY DEFINER, validation Zod sur toutes les server functions

## Hors périmètre (à confirmer si besoin)

- Système de commentaires sur le blog
- Newsletter / abonnement email
- Analytics (Plausible/GA)
- Préfixes d'URL par langue (`/fr/`, `/en/`) — pourrait être ajouté plus tard si besoin SEO renforcé
