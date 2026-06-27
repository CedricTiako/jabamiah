import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useTranslation } from "react-i18next";
import { listPublishedPosts } from "../lib/posts.functions";
import { buildSeoHead } from "../lib/seo";

export const Route = createFileRoute("/blog")({
  head: () => buildSeoHead({
    path: "/blog",
    title: "Blog — Jabamiah",
    description: "Réflexions, méditations et guidances autour des soins énergétiques, des plantes et du chemin de l'âme.",
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage ?? i18n.language ?? "fr").slice(0, 2);
  const fetchPosts = useServerFn(listPublishedPosts);
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts", locale],
    queryFn: () => fetchPosts({ data: { locale } }),
  });

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="eyebrow text-gold">{t("blog.eyebrow")}</span>
          <h1 className="mt-4 font-serif text-4xl text-forest md:text-5xl">{t("blog.title")}</h1>
          <p className="mt-4 mx-auto max-w-xl text-sm text-earth/75">{t("blog.subtitle")}</p>
        </div>

        <div className="mt-14">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0,1,2].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-cream-warm" />
              ))}
            </div>
          ) : !posts || posts.length === 0 ? (
            <p className="text-center text-earth/70">{t("blog.noPosts")}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-gold/20 transition-all hover:-translate-y-0.5 hover:ring-gold"
                >
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[16/10] w-full bg-gradient-to-br from-forest-soft to-forest-deep" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.published_at && (
                      <time className="text-xs uppercase tracking-[0.18em] text-gold">
                        {new Date(post.published_at).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
                      </time>
                    )}
                    <h2 className="mt-3 font-serif text-2xl text-forest group-hover:text-forest-deep">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm text-earth/75">{post.excerpt}</p>
                    )}
                    <span className="mt-6 text-xs uppercase tracking-[0.18em] text-forest">
                      {t("blog.readMore")} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
