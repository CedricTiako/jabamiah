## Refonte Jabamiah — alignée sur les maquettes client

Les maquettes fournies remplacent la direction « Mystique minimaliste ». Le plan technique reste valable, mais l'identité visuelle, la navigation, la promesse (consultations gratuites + cagnote solidaire) et le contenu sont entièrement repris des deux écrans fournis.

### Identité visuelle (extraite des maquettes)

- **Logo** : arbre stylisé en or + wordmark `JABAMIAH` (serif large, lettres espacées) avec sous-titre `MÉDECINE PARALLÈLE`
- **Palette** :
  - Vert forêt profond `#2C3A24` (fond bandeaux, footer, cartes)
  - Or doré `#C4A661` (accents, CTA, séparateurs, italiques)
  - Crème/sable `#F5F0E6` (fond principal)
  - Brun terre `#3A2E1F` (texte foncé)
  - Rose poudré `#F4D7CE` (bandeau gagnote solidaire)
- **Typographie** :
  - Titres : serif élégante avec italiques pour mots clés (style Cormorant Garamond ou Playfair Display)
  - Corps : sans-serif neutre fine (Inter ou Manrope)
  - Petites étiquettes en majuscules espacées
- **Iconographie** : icônes line en or (calendrier, cœur, feuille, yin-yang, fleur de lotus, soleil)
- **Photographie** : nature, mortier/pilon, cristaux, mains qui tiennent une plante, méditation, fleur de vie lumineuse, forêts brumeuses
- **Détails déco** : petits cœurs `♡`, brindilles dorées, séparateurs avec feuille

### Structure de la page d'accueil (mockup 1)

1. **Bandeau supérieur vert** sur 2 messages alternés : `♡ CONSULTATIONS ÉNERGÉTIQUES GRATUITES SUR RENDEZ-VOUS` | `♡ GAGNOTE SOLIDAIRE : VOS DONS SOUTIENNENT CEUX QUI EN ONT BESOIN ♡`
2. **Navigation** : Logo à gauche — `ACCUEIL · À PROPOS · SOINS & THÉRAPIES · PLANTES & REMÈDES · TÉMOIGNAGES · BLOG · CONTACT` — CTA encadré `📅 PRENDRE RENDEZ-VOUS / CONSULTATION GRATUITE`
3. **Hero** : photo pleine largeur (mortier, cristaux, bougie, fleur de vie lumineuse en surimpression). À gauche : étiquette `SOINS ÉNERGÉTIQUES & MÉDECINE NATURELLE`, titre `Retrouvez l'équilibre du corps, de l'esprit et de l'âme` (mots `corps`, `esprit`, `âme` en italique or), sous-titre, 2 CTA (`PRENDRE RDV` vert plein + `DÉCOUVRIR MES APPROCHES` outline), preuve sociale `+ de 500 personnes accompagnées` avec avatars et étoiles
4. **Carte flottante droite** (encart vert sombre) : `CONSULTATIONS 100% GRATUITES` + liste à puces feuilles
5. **Carte sticky CTA** (sous l'encart) : `📅 PRENDRE RENDEZ-VOUS` + bouton or `RÉSERVER MAINTENANT`, mention `En présentiel ou à distance`, icônes Téléphone / WhatsApp / Email
6. **Bande 4 valeurs** : Approche naturelle · Écoute & bienveillance · Énergie & harmonie · Soutien global (icônes rondes crème, texte court)
7. **Section « Mes Approches »** (titre serif centré, sous-titre italique, séparateur feuille) : grille 5 cartes
   - Soins énergétiques · Guérison par la pensée · Plantes & remèdes naturels · Harmonisation globale · Développement spirituel
   - Chaque carte : photo carrée, badge icône or, titre majuscules, paragraphe
8. **Section « Gagnote Solidaire »** sur fond rose poudré : ruban rose (cancer) + main lumineuse à gauche, slogan `Ensemble, faisons la différence ♡`, texte explicatif, 3 piliers (Vos dons soutiennent / Les fonds sont reversés / Votre générosité apporte), encart `FAIRE UN DON` avec QR code et `Merci du fond du cœur ♡`
9. **Bandeau citation** sur photo nature : `« Le bien que tu fais aujourd'hui, revient toujours à ton âme. »`
10. **Footer vert** : logo + tagline, 3 colonnes (Consultations gratuites · Contact rapide WhatsApp/Téléphone/Email · Engagement), bloc `SUIVEZ-MOI` Facebook/Instagram/YouTube/WhatsApp, mentions légales

### Structure de la page À propos (mockup 2)

- Hero identique en mise en page : étiquette `QUI JE SUIS`, titre `Un chemin de cœur au service de l'humain` (mots `cœur` et `l'humain` en italique or), paragraphes témoignage personnel, 2 cartes vert/crème (`MES CONSULTATIONS SONT TOTALEMENT GRATUITES` / `SUR RENDEZ-VOUS — Je suis là pour vous`)
- **Pourquoi je le fais** : 2 colonnes texte + 3 valeurs avec icônes (Bienveillance / Amour inconditionnel / Élévation de l'âme) + carte verte citation à droite (`Mon intention est simple…`)
- **Comment je vous accompagne** : 5 piliers ligne (Écoute & accueil · Énergie & équilibre · Plantes & nature · Guidance & lumière · Évolution & paix)
- Section gagnote solidaire identique à l'accueil
- Bandeau CTA `CONSULTATION GRATUITE SUR RENDEZ-VOUS` + bouton or `PRENDRE RDV`, mentions (100% gratuit / Sur rendez-vous / En toute confidentialité)
- Citation finale identique
- Footer identique

### Pages restantes à concevoir dans le même langage visuel

- `/soins-et-therapies` : détail des 5 approches en pages individuelles (`/soins-et-therapies/$slug`)
- `/plantes-et-remedes` : présentation des plantes médicinales et remèdes naturels utilisés
- `/temoignages` : grille de témoignages clients (avatar, étoiles, citation, prénom)
- `/blog` + `/blog/$category/$slug` : style éditorial cohérent
- `/contact` : formulaire + Calendly embarqué + coordonnées
- `/mentions-legales`, `/politique-de-confidentialite`

### Navigation revue (vs site actuel)

| Avant | Après |
|---|---|
| Accueil, À propos, Blog | Accueil, **À propos**, **Soins & Thérapies**, **Plantes & Remèdes**, **Témoignages**, Blog, Contact |
| Connexion / Inscription visibles | Auth déplacée en bas de footer (espace client discret) |
| Slider hero 4 slides | Hero statique unique |
| Stats fantaisistes (7, 777…) | Preuve sociale réelle `+ de 500 personnes accompagnées` |

### Périmètre fonctionnel (inchangé)

1. **Site vitrine multilingue** — 7 pages publiques + détails
2. **Blog dynamique** + back-office d'administration
3. **Espace client authentifié** (profil, historique de RDV)
4. **Système de cagnote solidaire** : QR code + lien externe vers une cagnotte (Leetchi / HelloAsso — à fournir par le client, sinon placeholder)

### Architecture des routes (TanStack Start)

```
__root.tsx                          shell + bandeau top + nav + footer + i18n
index.tsx                           Accueil
about.tsx                           À propos
soins-et-therapies.tsx              Liste des 5 approches
soins-et-therapies.$slug.tsx        Détail approche
plantes-et-remedes.tsx
temoignages.tsx
blog.tsx                            Liste + filtres catégorie
blog.$category.$slug.tsx            Article
contact.tsx                         Formulaire + Calendly
gagnote.tsx                         Page dédiée don (QR + lien externe)
auth.tsx                            Connexion/Inscription/Reset
reset-password.tsx
mentions-legales.tsx
politique-de-confidentialite.tsx
_authenticated/route.tsx            Gate (intégration Supabase)
_authenticated/espace.tsx           Profil + historique RDV
_authenticated/admin.articles.tsx   CRUD articles
_authenticated/admin.articles.$id.tsx
_authenticated/admin.temoignages.tsx CRUD témoignages
_authenticated/admin.messages.tsx   Boîte messages contact
api/public/contact.ts               POST formulaire (Resend)
```

### Lovable Cloud — schéma

```
profiles                  user_id, display_name, locale, phone
user_roles                user_id, role (admin|client)
has_role(uid, role)       SECURITY DEFINER

article_categories        slug, names_i18n (jsonb)
articles                  slug, category_id, cover_url, author_id, published_at, status
article_translations      article_id, locale, title, excerpt, body_md

therapies                 slug, icon, cover_url, order
therapy_translations      therapy_id, locale, title, short_desc, body_md

testimonials              author_name, rating, locale, body, photo_url, published

consultations             client_id, scheduled_at, status, notes (admin-only)
contact_messages          name, email, phone, subject, message, locale, created_at, status
```

Toutes les tables `public.*` : `GRANT` explicites, RLS active, policies (lecture publique sur articles/témoignages/thérapies publiés ; admin via `has_role` pour CRUD ; client voit ses consultations/profil).

### Internationalisation

- `i18next` + `react-i18next` + détection navigateur
- Langues : **FR (défaut), EN, ES, DE, IT, NL, PL, PT**
- Traductions UI dans `src/i18n/locales/{lang}/{namespace}.json`
- Contenus (articles, thérapies, témoignages) traduits par enregistrement
- Sélecteur de langue discret dans la nav (sous forme `FR ▾`)
- `<html lang>` dynamique + `hreflang` dans `<head>`

### Authentification

- Email/password + Google OAuth (via `lovable.auth.signInWithOAuth`)
- Trigger DB création profil + rôle `client` à l'inscription
- `/auth` publique avec onglets · `/reset-password` obligatoire
- Bouton « Espace client » discret dans le footer uniquement

### Server functions (`src/lib/*.functions.ts`)

- **Publiques** : `listPublishedArticles`, `getArticleBySlug`, `listTherapies`, `getTherapyBySlug`, `listTestimonials`, `submitContactMessage` (Zod + Resend)
- **Authentifiées (`requireSupabaseAuth`)** : `getMyConsultations`, `updateMyProfile`
- **Admin (auth + check `has_role('admin')`)** : CRUD articles/thérapies/témoignages, `adminListContactMessages`

### Intégrations

- **Calendly** : iframe sur `/contact` + boutons RDV globaux pointant vers `https://calendly.com/eirl-omont/60min`
- **Resend** (connecteur Lovable) : email transactionnel formulaire contact
- **Cagnote externe** : lien + QR code (URL à fournir par le client, placeholder en attendant)
- **WhatsApp** : lien `https://wa.me/<numéro>` (numéro à confirmer)
- **Réseaux sociaux** : Facebook / Instagram / YouTube (URLs à fournir)

### Conformité

- Bandeau cookies (analytics opt-in)
- Mentions légales + politique de confidentialité
- Validation Zod client + serveur sur tous les formulaires
- RGPD : consentement explicite sur le formulaire de contact

### Plan d'exécution

1. **Fondations design** : tokens couleurs/typo dans `src/styles.css`, fonts via `<link>` dans `__root.tsx`, composants partagés (bandeau top, nav, footer, bouton CTA or, carte verte, séparateur feuille)
2. **Page d'accueil** intégrale d'après le mockup 1 (hero, encart consultations gratuites, carte sticky RDV, 4 valeurs, 5 approches, gagnote solidaire, citation, footer)
3. **Page À propos** intégrale d'après le mockup 2
4. **Pages Soins & Thérapies, Plantes & Remèdes, Témoignages, Contact** dans le même langage
5. **Lovable Cloud + auth** : activation, schéma complet, RLS, GRANT, page `/auth`, reset password
6. **Blog public** + admin back-office
7. **Espace client** : profil + historique consultations
8. **Multilingue** : extraction de toutes les chaînes FR, ajout EN/ES/DE/IT/NL/PL/PT
9. **Contact opérationnel** : connecteur Resend, server fn `submitContactMessage`
10. **SEO & finitions** : `<head>` par route (title/description/og/hreflang), `sitemap.xml`, `robots.txt`, génération des images (mortier+cristaux, mains plante, méditation, fleur de vie…), audit performance et accessibilité

### Stack technique

- TanStack Start + React 19 + Tailwind v4 (CSS-first dans `src/styles.css`)
- shadcn/ui (Button, Input, Tabs, Dialog, DropdownMenu, Form)
- TanStack Query pour l'état serveur
- Markdown : `react-markdown` + `remark-gfm`
- Validation : `zod`
- Couche service dédiée (jamais de `fetch` direct dans les composants — convention workspace)
- TS strict, exports nommés, kebab-case fichiers, camelCase variables, PascalCase composants

### Questions ouvertes à clarifier en cours de build

- URL exacte de la cagnotte solidaire (Leetchi / HelloAsso / autre) → placeholder en attendant
- Numéro WhatsApp réel (le `07 45 15 54 51` du site actuel ou le `+33 6 12 34 56 78` de la maquette À propos ?)
- URLs Facebook / Instagram / YouTube
- Témoignages réels à intégrer (sinon contenu factice marqué `Lorem`)
- Photo portrait du praticien (sinon génération IA neutre)

Approuve ce plan révisé pour que je passe en construction.
