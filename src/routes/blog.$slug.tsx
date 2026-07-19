import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useTranslation } from "react-i18next";
import { getPostBySlug } from "../lib/posts.functions";
import { buildSeoHead, absoluteUrl } from "../lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug({ data: { slug: params.slug, locale: "fr" } });
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} — Jabamiah` : "Article — Jabamiah";
    const description = post?.meta_description ?? post?.excerpt ?? "Article du blog Jabamiah.";
    const head = buildSeoHead({
      path: `/blog/${params.slug}`,
      title,
      description,
      image: post?.cover_image_url ?? undefined,
      type: "article",
    });
    return {
      ...head,
      scripts: post
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description,
                image: post.cover_image_url ?? undefined,
                datePublished: post.published_at ?? undefined,
                dateModified: post.updated_at ?? post.published_at ?? undefined,
                author: { "@type": "Person", name: "Jabamiah" },
                publisher: { "@type": "Organization", name: "Jabamiah" },
                mainEntityOfPage: absoluteUrl(`/blog/${params.slug}`),
              }),
            },
          ]
        : [],
    };
  },
  component: BlogDetail,
  notFoundComponent: () => (
    <section className="bg-cream py-20 text-center">
      <h1 className="font-serif text-3xl text-forest">Article introuvable</h1>
      <Link to="/blog" className="mt-6 inline-block text-sm uppercase tracking-[0.18em] text-gold">
        ← Retour au blog
      </Link>
    </section>
  ),
  errorComponent: () => (
    <section className="bg-cream py-20 text-center">
      <h1 className="font-serif text-3xl text-forest">Une erreur est survenue</h1>
      <Link to="/blog" className="mt-6 inline-block text-sm uppercase tracking-[0.18em] text-gold">
        ← Retour au blog
      </Link>
    </section>
  ),
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const { post: initial } = Route.useLoaderData();
  const { t, i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage ?? i18n.language ?? "fr").slice(0, 2);
  const fetchPost = useServerFn(getPostBySlug);
  const { data } = useQuery({
    queryKey: ["blog-post", slug, locale],
    queryFn: () => fetchPost({ data: { slug, locale } }),
    initialData: initial,
  });
  const post = data ?? initial;

  return (
    <article className="bg-cream py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          to="/blog"
          className="text-xs uppercase tracking-[0.18em] text-gold hover:text-forest"
        >
          ← {t("blog.backToList")}
        </Link>
        {post.published_at && (
          <time className="mt-6 block text-xs uppercase tracking-[0.18em] text-earth/70">
            {t("blog.publishedOn")}{" "}
            {new Date(post.published_at).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        <h1 className="mt-4 font-serif text-4xl leading-tight text-forest md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-4 text-lg text-earth/80">{post.excerpt}</p>}
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt=""
            className="mt-10 aspect-[16/9] w-full rounded-xl object-cover ring-1 ring-gold/20"
          />
        )}
        {post.body && (
          <div className="prose-jabamiah mt-12 whitespace-pre-wrap text-base leading-relaxed text-earth/90">
            {post.body}
          </div>
        )}
      </div>
    </article>
  );
}
