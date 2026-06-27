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
      { title: "Jabamiah — Médecine parallèle & soins énergétiques" },
      {
        name: "description",
        content:
          "Consultations énergétiques gratuites avec Jabamiah, medium et thérapeute holistique à Forges-les-Eaux. Soins, plantes et accompagnement pour le corps, l'esprit et l'âme.",
      },
      { name: "author", content: "Jabamiah" },
      { property: "og:title", content: "Jabamiah — Médecine parallèle & soins énergétiques" },
      {
        property: "og:description",
        content:
          "Soins énergétiques, médecine naturelle et accompagnement spirituel. Consultations 100% gratuites sur rendez-vous.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Jabamiah — Médecine parallèle & soins énergétiques" },
      { name: "description", content: "Jabamiah vous accompagne sur le chemin du bien-être grâce aux soins énergétiques, à la radiesthésie et aux plantes naturelles. Basé à Forges-les-Eaux, en Norman" },
      { property: "og:description", content: "Jabamiah vous accompagne sur le chemin du bien-être grâce aux soins énergétiques, à la radiesthésie et aux plantes naturelles. Basé à Forges-les-Eaux, en Norman" },
      { name: "twitter:description", content: "Jabamiah vous accompagne sur le chemin du bien-être grâce aux soins énergétiques, à la radiesthésie et aux plantes naturelles. Basé à Forges-les-Eaux, en Norman" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/1P55axkM51aQq34kcmIP9HVh8bl1/social-images/social-1782555777785-jabamiah-social-image.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/1P55axkM51aQq34kcmIP9HVh8bl1/social-images/social-1782555777785-jabamiah-social-image.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-cream">
        <TopBanner />
        <SiteNav />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
