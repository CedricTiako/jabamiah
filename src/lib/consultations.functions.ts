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
  const { data, error } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

export const adminListConsultations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("consultations")
      .select("id, client_id, consultation_date, duration_minutes, mood, objectives, techniques, report, advice, clients(full_name)")
      .order("consultation_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminListConsultationsByClient = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { client_id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("consultations")
      .select("id, consultation_date, duration_minutes, mood, objectives, techniques, report, advice")
      .eq("client_id", data.client_id)
      .order("consultation_date", { ascending: false });
    if (error) throw error;
    return rows ?? [];
  });

const UpsertSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  client_id: z.string().uuid(),
  consultation_date: z.string().min(1),
  duration_minutes: z.coerce.number().int().min(5).max(600),
  mood: z.coerce.number().int().min(1).max(10).nullable().optional(),
  objectives: z.string().max(2000).nullable().optional(),
  techniques: z.string().max(1000).nullable().optional(),
  report: z.string().min(1).max(10000),
  advice: z.string().max(2000).nullable().optional(),
});

export const adminUpsertConsultation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      client_id: data.client_id,
      consultation_date: data.consultation_date,
      duration_minutes: data.duration_minutes,
      mood: data.mood ?? null,
      objectives: data.objectives || null,
      techniques: data.techniques || null,
      report: data.report,
      advice: data.advice || null,
    };

    if (data.id) {
      const { error } = await context.supabase.from("consultations").update(payload).eq("id", data.id);
      if (error) throw error;
      return { id: data.id };
    }

    const { data: created, error } = await context.supabase
      .from("consultations")
      .insert({ ...payload, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw error;
    return { id: created.id };
  });
