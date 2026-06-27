import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "../integrations/supabase/client";
import { adminGetPost, adminUpsertPost, checkIsAdmin } from "../lib/posts.functions";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../i18n";

type TranslationDraft = {
  locale: SupportedLanguage;
  title: string;
  excerpt: string;
  body: string;
  meta_description: string;
};

const EMPTY: TranslationDraft = { locale: "fr", title: "", excerpt: "", body: "", meta_description: "" };

export const Route = createFileRoute("/admin/posts/$id")({
  head: () => ({ meta: [{ title: "Éditeur — Jabamiah Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminPostEditor,
});

function AdminPostEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const checkAdmin = useServerFn(checkIsAdmin);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate({ to: "/admin" });
        return;
      }
      try {
        const r = await checkAdmin();
        if (!r.isAdmin) navigate({ to: "/admin" });
        else setReady(true);
      } catch {
        navigate({ to: "/admin" });
      }
    });
  }, [navigate, checkAdmin]);

  const get = useServerFn(adminGetPost);
  const { data: post } = useQuery({
    queryKey: ["admin-post", id],
    queryFn: () => (isNew ? null : get({ data: { id } })),
    enabled: ready,
  });

  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [activeLocale, setActiveLocale] = useState<SupportedLanguage>("fr");
  const [translations, setTranslations] = useState<Record<SupportedLanguage, TranslationDraft>>(() => {
    const obj = {} as Record<SupportedLanguage, TranslationDraft>;
    SUPPORTED_LANGUAGES.forEach((l) => { obj[l.code] = { ...EMPTY, locale: l.code }; });
    return obj;
  });

  useEffect(() => {
    if (post) {
      setSlug(post.slug);
      setStatus(post.status as "draft" | "published");
      setCoverImageUrl(post.cover_image_url ?? "");
      const next = {} as Record<SupportedLanguage, TranslationDraft>;
      SUPPORTED_LANGUAGES.forEach((l) => { next[l.code] = { ...EMPTY, locale: l.code }; });
      const arr = (post.post_translations ?? []) as Array<{ locale: string; title: string; excerpt: string | null; body: string | null; meta_description: string | null }>;
      arr.forEach((tr) => {
        const code = tr.locale as SupportedLanguage;
        if (next[code]) {
          next[code] = {
            locale: code,
            title: tr.title ?? "",
            excerpt: tr.excerpt ?? "",
            body: tr.body ?? "",
            meta_description: tr.meta_description ?? "",
          };
        }
      });
      setTranslations(next);
    }
  }, [post]);

  const upsert = useServerFn(adminUpsertPost);
  const saveMutation = useMutation({
    mutationFn: () => upsert({
      data: {
        id: isNew ? null : id,
        slug,
        status,
        cover_image_url: coverImageUrl || null,
        translations: SUPPORTED_LANGUAGES
          .map((l) => translations[l.code])
          .filter((tr) => tr.title.trim().length > 0)
          .map((tr) => ({
            locale: tr.locale,
            title: tr.title,
            excerpt: tr.excerpt || null,
            body: tr.body || null,
            meta_description: tr.meta_description || null,
          })),
      },
    }),
    onSuccess: ({ id: newId }) => {
      if (isNew && newId) navigate({ to: "/admin/posts/$id", params: { id: newId } });
    },
  });

  if (!ready) return <div className="bg-cream py-24 text-center text-earth/70">…</div>;

  const current = translations[activeLocale];

  return (
    <section className="bg-cream py-12">
      <div className="mx-auto max-w-5xl px-6">
        <Link to="/admin" className="text-xs uppercase tracking-[0.18em] text-gold hover:text-forest">
          ← {t("admin.backToPosts")}
        </Link>
        <h1 className="mt-4 font-serif text-3xl text-forest">{isNew ? t("admin.newPost") : t("admin.editPost")}</h1>

        <div className="mt-8 grid gap-6 rounded-xl bg-card p-6 ring-1 ring-gold/20 lg:grid-cols-3">
          <label className="block lg:col-span-2">
            <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.slug")}</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""))}
              placeholder={t("admin.slugHint")}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.status")}</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="draft">{t("admin.draft")}</option>
              <option value="published">{t("admin.published")}</option>
            </select>
          </label>
          <label className="block lg:col-span-3">
            <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.cover")}</span>
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://…"
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <span className="mt-1 block text-xs text-earth/60">{t("admin.coverHint")}</span>
          </label>
        </div>

        <h2 className="mt-10 font-serif text-2xl text-forest">{t("admin.translations")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.map((l) => {
            const has = translations[l.code].title.trim().length > 0;
            return (
              <button
                key={l.code}
                onClick={() => setActiveLocale(l.code)}
                className={`rounded-md px-3 py-1.5 text-xs uppercase tracking-[0.15em] ${activeLocale === l.code ? "bg-forest text-cream" : "bg-cream-warm text-forest ring-1 ring-gold/30"}`}
              >
                {l.code} {has ? "✓" : ""}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 rounded-xl bg-card p-6 ring-1 ring-gold/20">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.postTitle")} ({activeLocale})</span>
            <input
              value={current.title}
              onChange={(e) => setTranslations((s) => ({ ...s, [activeLocale]: { ...s[activeLocale], title: e.target.value } }))}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.excerpt")}</span>
            <textarea
              rows={2}
              value={current.excerpt}
              onChange={(e) => setTranslations((s) => ({ ...s, [activeLocale]: { ...s[activeLocale], excerpt: e.target.value } }))}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.body")}</span>
            <textarea
              rows={14}
              value={current.body}
              onChange={(e) => setTranslations((s) => ({ ...s, [activeLocale]: { ...s[activeLocale], body: e.target.value } }))}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.15em] text-forest">{t("admin.metaDescription")}</span>
            <input
              maxLength={200}
              value={current.meta_description}
              onChange={(e) => setTranslations((s) => ({ ...s, [activeLocale]: { ...s[activeLocale], meta_description: e.target.value } }))}
              className="mt-1 w-full rounded-md border border-gold/30 bg-cream-warm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </label>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !slug || !translations.fr.title}
            className="rounded-md bg-forest px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream hover:bg-forest-soft disabled:opacity-50"
          >
            {saveMutation.isPending ? t("admin.saving") : t("admin.save")}
          </button>
          {saveMutation.isSuccess && <span className="text-sm text-forest">{t("admin.saved")} ✓</span>}
          {saveMutation.isError && <span className="text-sm text-red-700">{t("admin.saveError")}</span>}
        </div>
      </div>
    </section>
  );
}
