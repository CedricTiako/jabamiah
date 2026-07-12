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

const ASSESSMENT_COLUMNS =
  "id, client_id, assessment_date, axis_energie, axis_stress, axis_emotions, axis_motivation, axis_confiance, axis_fatigue, axis_douleurs, axis_concentration, observations";

export const adminListEnergyAssessments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("energy_assessments")
      .select(`${ASSESSMENT_COLUMNS}, clients(full_name)`)
      .order("assessment_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminListEnergyAssessmentsByClient = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { client_id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("energy_assessments")
      .select(ASSESSMENT_COLUMNS)
      .eq("client_id", data.client_id)
      .order("assessment_date", { ascending: false });
    if (error) throw error;
    return rows ?? [];
  });

const UpsertSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  client_id: z.string().uuid(),
  assessment_date: z.string().min(1),
  axis_energie: z.coerce.number().int().min(0).max(10),
  axis_stress: z.coerce.number().int().min(0).max(10),
  axis_emotions: z.coerce.number().int().min(0).max(10),
  axis_motivation: z.coerce.number().int().min(0).max(10),
  axis_confiance: z.coerce.number().int().min(0).max(10),
  axis_fatigue: z.coerce.number().int().min(0).max(10),
  axis_douleurs: z.coerce.number().int().min(0).max(10),
  axis_concentration: z.coerce.number().int().min(0).max(10),
  observations: z.string().max(2000).nullable().optional(),
});

export const adminUpsertEnergyAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      client_id: data.client_id,
      assessment_date: data.assessment_date,
      axis_energie: data.axis_energie,
      axis_stress: data.axis_stress,
      axis_emotions: data.axis_emotions,
      axis_motivation: data.axis_motivation,
      axis_confiance: data.axis_confiance,
      axis_fatigue: data.axis_fatigue,
      axis_douleurs: data.axis_douleurs,
      axis_concentration: data.axis_concentration,
      observations: data.observations || null,
    };

    if (data.id) {
      const { error } = await context.supabase.from("energy_assessments").update(payload).eq("id", data.id);
      if (error) throw error;
      return { id: data.id };
    }

    const { data: created, error } = await context.supabase
      .from("energy_assessments")
      .insert({ ...payload, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw error;
    return { id: created.id };
  });
