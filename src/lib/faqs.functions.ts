import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";
import type { Database } from "../integrations/supabase/types";

function getPublicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

async function assertAdmin(ctx: { supabase: ReturnType<typeof getPublicClient>; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

export const adminListFaqs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("faqs")
      .select("id, question, answer, sort_order, published, created_at")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

const UpsertSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  question: z.string().trim().min(3).max(300),
  answer: z.string().trim().min(3).max(3000),
  sort_order: z.coerce.number().int().min(0).max(9999),
  published: z.boolean(),
});

export const adminUpsertFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      question: data.question,
      answer: data.answer,
      sort_order: data.sort_order,
      published: data.published,
    };

    if (data.id) {
      const { error } = await context.supabase.from("faqs").update(payload).eq("id", data.id);
      if (error) throw error;
      return { id: data.id };
    }

    const { data: created, error } = await context.supabase
      .from("faqs")
      .insert({ ...payload, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw error;
    return { id: created.id };
  });

export const adminDeleteFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("faqs").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listPublishedFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
});
