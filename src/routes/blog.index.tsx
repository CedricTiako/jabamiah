import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { listPublishedPosts } from "../lib/posts.functions";
import { buildSeoHead } from "../lib/seo";
import { getServerLocale } from "../lib/locale-server";
import { tServer } from "../lib/t-server";
import { LeafDivider } from "../components/site/leaf-divider";

export const Route = createFileRoute("/blog/")({
  loader: async () => ({ locale: await getServerLocale() }),
  head: ({ loaderData }) => {
    const loc = loaderData?.locale ?? "fr";
    return buildSeoHead({
      path: "/blog",
      title: tServer(loc, "seo.blog.title"),
      description: tServer(loc, "seo.blog.description"),
    });
  },
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
    <>
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="absolute inset-0 bg-linear-to-b from-forest-deep/90 to-forest/80" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="eyebrow text-gold">{t("blog.eyebrow")}</span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl">{t("blog.title")}</h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-cream/85">{t("blog.subtitle")}</p>
          <LeafDivider className="mt-8 text-gold" />
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-6">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-cream-warm" />
              ))}
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center">
              <p className="font-serif text-xl italic text-earth/60">{t("blog.noPosts")}</p>
            </div>
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
                      className="aspect-16/10 w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-16/10 w-full bg-linear-to-br from-forest-soft to-forest-deep" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.published_at && (
                      <time className="text-xs uppercase tracking-[0.18em] text-gold">
                        {new Date(post.published_at).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    )}
                    <h2 className="mt-3 font-serif text-2xl text-forest group-hover:text-forest-deep">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm text-earth/75">{post.excerpt}</p>
                    )}
                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-forest">
                      {t("blog.readMore")}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
