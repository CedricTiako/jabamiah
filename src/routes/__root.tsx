import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { TopBanner } from "../components/site/top-banner";
import { SiteNav } from "../components/site/site-nav";
import { SiteFooter } from "../components/site/site-footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <span className="eyebrow text-gold">404</span>
      <h1 className="mt-4 font-serif text-5xl text-forest">Page introuvable</h1>
      <p className="mt-3 max-w-md text-sm text-earth/70">
        Cette page n'existe pas ou a été déplacée. Laissez-vous guider vers la lumière.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-md bg-forest px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <h1 className="font-serif text-3xl text-forest">Cette page n'a pas pu se charger</h1>
      <p className="mt-3 max-w-md text-sm text-earth/70">
        Une erreur s'est produite. Vous pouvez réessayer ou revenir à l'accueil.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="inline-flex items-center rounded-md bg-forest px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft"
        >
          Réessayer
        </button>
        <a
          href="/"
          className="inline-flex items-center rounded-md border border-gold/40 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-forest hover:bg-cream-warm"
        >
          Accueil
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1E3A2B" },
      { title: "Jabamiah — Médecine parallèle & soins énergétiques" },
      {
        name: "description",
        content:
          "Jabamiah vous accompagne sur le chemin du bien-être grâce aux soins énergétiques, à la radiesthésie et aux plantes naturelles. Consultations 100% gratuites à Forges-les-Eaux (Normandie) ou à distance.",
      },
      { name: "author", content: "Jabamiah" },
      { property: "og:site_name", content: "Jabamiah" },
      { property: "og:title", content: "Jabamiah — Médecine parallèle & soins énergétiques" },
      {
        property: "og:description",
        content:
          "Soins énergétiques, médecine naturelle et accompagnement spirituel. Consultations 100% gratuites sur rendez-vous.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:image", content: "https://jabamiah.smartsolution-it.com/og-default.jpg" },
      { property: "og:image:width", content: "1216" },
      { property: "og:image:height", content: "640" },
      { property: "og:image:alt", content: "Jabamiah — Médecine parallèle & soins énergétiques" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Jabamiah — Médecine parallèle & soins énergétiques" },
      {
        name: "twitter:description",
        content:
          "Soins énergétiques, médecine naturelle et accompagnement spirituel. Consultations 100% gratuites sur rendez-vous.",
      },
      { name: "twitter:image", content: "https://jabamiah.smartsolution-it.com/og-default.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/jabamiah-icon.svg" },
      { rel: "icon", type: "image/svg+xml", media: "(prefers-color-scheme: dark)", href: "/jabamiah-icon-dark.svg" },
      { rel: "alternate icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/jabamiah-icon.svg" },
      { rel: "mask-icon", href: "/jabamiah-icon.svg", color: "#1E3A2B" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = (i18n.resolvedLanguage ?? i18n.language ?? "fr").slice(0, 2);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [i18n.resolvedLanguage, i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:left-4 focus:top-4 focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-sm focus:text-cream focus:outline-none"
      >
        Aller au contenu principal
      </a>
      <div className="flex min-h-screen flex-col bg-cream">
        <TopBanner />
        <SiteNav />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
