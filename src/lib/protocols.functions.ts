import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";
import type { Database } from "../integrations/supabase/types";

const PROTOCOL_CATEGORIES = [
  "energetique",
  "meditation",
  "respiration",
  "harmonisation",
  "purification",
] as const;

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

export const adminListProtocols = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("protocols")
      .select("id, name, description, category, duration_minutes, steps, warnings, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

const UpsertSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  category: z.enum(PROTOCOL_CATEGORIES).nullable().optional(),
  duration_minutes: z.number().int().min(0).max(600).nullable().optional(),
  steps: z.string().max(5000).nullable().optional(),
  warnings: z.string().max(2000).nullable().optional(),
});

export const adminUpsertProtocol = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      name: data.name,
      description: data.description,
      category: data.category || null,
      duration_minutes: data.duration_minutes ?? null,
      steps: data.steps || null,
      warnings: data.warnings || null,
    };

    if (data.id) {
      const { error } = await context.supabase.from("protocols").update(payload).eq("id", data.id);
      if (error) throw error;
      return { id: data.id };
    }

    const { data: created, error } = await context.supabase
      .from("protocols")
      .insert({ ...payload, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw error;
    return { id: created.id };
  });

export const adminDeleteProtocol = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("protocols").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
