import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";
import type { Database } from "../integrations/supabase/types";

const LOCALES = ["fr", "en", "es", "de", "it", "nl", "pl", "pt"] as const;
const DEFAULT_LOCALE = "fr";

function getPublicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export interface PostListItem {
  id: string;
  slug: string;
  cover_image_url: string | null;
  published_at: string | null;
  title: string;
  excerpt: string | null;
}

export interface PostDetail extends PostListItem {
  body: string | null;
  meta_description: string | null;
  locale: string;
  updated_at?: string | null;
}

export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((data: { locale?: string }) => ({ locale: data?.locale ?? DEFAULT_LOCALE }))
  .handler(async ({ data }): Promise<PostListItem[]> => {
    const sb = getPublicClient();
    const { data: posts, error } = await sb
      .from("posts")
      .select("id, slug, cover_image_url, published_at, post_translations(title, excerpt, locale)")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (posts ?? []).map((p) => {
      const translations = (p.post_translations ?? []) as Array<{ title: string; excerpt: string | null; locale: string }>;
      const t = translations.find((x) => x.locale === data.locale) ?? translations.find((x) => x.locale === DEFAULT_LOCALE) ?? translations[0];
      return {
        id: p.id,
        slug: p.slug,
        cover_image_url: p.cover_image_url,
        published_at: p.published_at,
        title: t?.title ?? p.slug,
        excerpt: t?.excerpt ?? null,
      };
    });
  });

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; locale?: string }) => ({ slug: data.slug, locale: data?.locale ?? DEFAULT_LOCALE }))
  .handler(async ({ data }): Promise<PostDetail | null> => {
    const sb = getPublicClient();
    const { data: post, error } = await sb
      .from("posts")
      .select("id, slug, cover_image_url, published_at, updated_at, post_translations(title, excerpt, body, meta_description, locale)")
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw error;
    if (!post) return null;
    const translations = (post.post_translations ?? []) as Array<{ title: string; excerpt: string | null; body: string | null; meta_description: string | null; locale: string }>;
    const t = translations.find((x) => x.locale === data.locale) ?? translations.find((x) => x.locale === DEFAULT_LOCALE) ?? translations[0];
    if (!t) return null;
    return {
      id: post.id,
      slug: post.slug,
      cover_image_url: post.cover_image_url,
      published_at: post.published_at,
      updated_at: post.updated_at,
      title: t.title,
      excerpt: t.excerpt,
      body: t.body,
      meta_description: t.meta_description,
      locale: t.locale,
    };
  });

// ============== ADMIN ==============

async function assertAdmin(ctx: { supabase: ReturnType<typeof getPublicClient>; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("posts")
      .select("id, slug, status, cover_image_url, published_at, updated_at, post_translations(title, locale)")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminGetPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: post, error } = await context.supabase
      .from("posts")
      .select("id, slug, status, cover_image_url, published_at, post_translations(id, locale, title, excerpt, body, meta_description)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return post;
  });

const TranslationSchema = z.object({
  locale: z.enum(LOCALES),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).nullable().optional(),
  body: z.string().max(50000).nullable().optional(),
  meta_description: z.string().max(200).nullable().optional(),
});

const UpsertSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "published"]),
  cover_image_url: z.string().url().nullable().optional(),
  translations: z.array(TranslationSchema).min(1),
});

export const adminUpsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const now = new Date().toISOString();
    const publishedAt = data.status === "published" ? now : null;
    let postId = data.id ?? null;

    if (postId) {
      const { error } = await context.supabase
        .from("posts")
        .update({
          slug: data.slug,
          status: data.status,
          cover_image_url: data.cover_image_url ?? null,
          published_at: data.status === "published" ? (publishedAt ?? undefined) : null,
        })
        .eq("id", postId);
      if (error) throw error;
    } else {
      const { data: created, error } = await context.supabase
        .from("posts")
        .insert({
          slug: data.slug,
          status: data.status,
          cover_image_url: data.cover_image_url ?? null,
          author_id: context.userId,
          published_at: publishedAt,
        })
        .select("id")
        .single();
      if (error) throw error;
      postId = created.id;
    }

    // Upsert translations
    const rows = data.translations.map((t) => ({
      post_id: postId!,
      locale: t.locale,
      title: t.title,
      excerpt: t.excerpt ?? null,
      body: t.body ?? null,
      meta_description: t.meta_description ?? null,
    }));
    const { error: trErr } = await context.supabase
      .from("post_translations")
      .upsert(rows, { onConflict: "post_id,locale" });
    if (trErr) throw trErr;

    return { id: postId };
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (error) throw error;
    return { isAdmin: !!data, userId: context.userId };
  });

export const adminListContactMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("contact_messages")
      .select("id, name, email, subject, message, locale, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return data ?? [];
  });
