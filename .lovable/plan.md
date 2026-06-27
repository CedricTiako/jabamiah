## Pages détaillées + Multilingue 8 langues

Deux chantiers livrés ensemble : remplacer les stubs `soins-et-therapies`, `plantes-et-remedes`, `temoignages` par des pages riches alignées sur la charte « Médecine Parallèle », puis brancher i18next sur l'ensemble du site avec 8 langues UE.

### 1. Pages détaillées

**`/soins-et-therapies`** — liste des 5 approches
- Hero : étiquette `SOINS & THÉRAPIES`, titre serif (mots clés italique or), sous-titre, séparateur feuille
- Grille 5 cartes (photo carrée + badge icône or + titre majuscules + paragraphe + lien « En savoir plus ») : Soins énergétiques · Guérison par la pensée · Plantes & remèdes · Harmonisation globale · Développement spirituel
- Bande « Comment se déroule une séance » (3 étapes numérotées or)
- Bandeau citation + CTA Calendly

**`/soins-et-therapies/$slug`** — page détail par approche
- Données statiques typées dans `src/content/therapies.ts` (slug, title, eyebrow, intro, sections, bienfaits[], deroulement, image)
- Hero image + intro, sections body, liste bienfaits avec puces feuille, encart vert « Pour qui ? », CTA RDV
- `notFoundComponent` si slug inconnu

**`/plantes-et-remedes`**
- Hero + intro sur la phytothérapie pratiquée
- Grille de 8-10 plantes (carte : photo, nom commun, nom latin italique or, propriétés clés, indications) — données dans `src/content/plants.ts`
- Section « Mes remèdes naturels » (tisanes, élixirs floraux, huiles) en 3 colonnes
- Avertissement médical encadré
- CTA consultation

**`/temoignages`**
- Hero + sous-titre
- Filtres pills (Tous / Soin énergétique / Guérison / Accompagnement spirituel)
- Grille masonry de 9-12 témoignages (avatar initiale or, 5 étoiles, citation serif italique, prénom + ville + date)
- Bandeau « Partagez votre expérience » avec lien vers `/contact`
- Données dans `src/content/testimonials.ts` (placeholders réalistes marqués `// TODO: remplacer par vrais témoignages`)

Génération de 6-8 images IA supplémentaires (plantes, séance, mains soignantes, portraits anonymes flous).

### 2. Internationalisation (i18next)

**Langues** : FR (défaut), EN, ES, DE, IT, NL, PL, PT

**Stack** : `i18next` + `react-i18next` + `i18next-browser-languagedetector` (détection navigateur + localStorage)

**Structure** :
```
src/i18n/
  index.ts                  init i18next
  locales/
    fr/{common,nav,home,about,therapies,plants,testimonials,contact,footer}.json
    en/...
    ...
```

**Intégration** :
- Provider initialisé dans `src/router.tsx` (côté client uniquement — pas de SSR i18n pour rester simple)
- Hook `useTranslation(ns)` dans tous les composants
- Extraction de TOUTES les chaînes FR existantes (top-banner, nav, footer, home, about, contact, nouvelles pages) en clés
- Sélecteur de langue : dropdown discret `FR ▾` dans la nav (desktop droite avant CTA, mobile en haut du menu)
- Persistance choix utilisateur via `localStorage` (`i18nextLng`)
- `<html lang>` dynamique mis à jour via `useEffect` au changement de langue
- Balises `hreflang` alternates dans `head()` du root

**Traductions** :
- FR : rédaction complète (source de vérité)
- EN, ES, DE, IT, NL, PL, PT : traductions générées (qualité native, ton wellness/spirituel, vouvoiement adapté à chaque langue)
- Contenus statiques (`therapies.ts`, `plants.ts`, `testimonials.ts`) : structure `{ fr: {...}, en: {...}, ... }` ou clés i18n référencées

### 3. Détails techniques

```text
src/
├── content/
│   ├── therapies.ts          # 5 approches typées
│   ├── plants.ts             # ~10 plantes
│   └── testimonials.ts       # ~12 témoignages
├── components/site/
│   ├── therapy-card.tsx
│   ├── plant-card.tsx
│   ├── testimonial-card.tsx
│   └── language-switcher.tsx
├── i18n/
│   ├── index.ts
│   └── locales/{8 langues}/*.json
└── routes/
    ├── soins-et-therapies.tsx          # remplace stub
    ├── soins-et-therapies.$slug.tsx    # nouveau
    ├── plantes-et-remedes.tsx          # remplace stub
    └── temoignages.tsx                 # remplace stub
```

Dépendances à installer : `i18next`, `react-i18next`, `i18next-browser-languagedetector`.

`head()` par route : title/description traduits via `i18n.t()` (lecture synchrone après init).

### 4. Hors périmètre (lots suivants)

- Lovable Cloud / auth / espace client / blog dynamique
- Connecteur Resend pour le formulaire de contact
- Traduction des contenus du blog (sera multilingue par enregistrement DB)
- SEO complet (sitemap.xml, robots.txt, JSON-LD)

Approuve pour que je passe en build.
