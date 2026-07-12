import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";
import type { Database } from "../integrations/supabase/types";

const CLIENT_STATUSES = ["Actif", "Fidèle", "Nouveau", "Inactif"] as const;

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

export const adminListClients = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("clients")
      .select("id, full_name, phone, email, city, birth_date, reason, status, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminGetClient = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: client, error } = await context.supabase
      .from("clients")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return client;
  });

const UpsertSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  full_name: z.string().min(1).max(200),
  phone: z.string().max(30).nullable().optional(),
  email: z.string().email().max(200).nullable().optional().or(z.literal("")),
  city: z.string().max(120).nullable().optional(),
  birth_date: z.string().nullable().optional(),
  reason: z.string().max(500).nullable().optional(),
  status: z.enum(CLIENT_STATUSES),
  private_notes: z.string().max(5000).nullable().optional(),
});

export const adminUpsertClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      full_name: data.full_name,
      phone: data.phone || null,
      email: data.email || null,
      city: data.city || null,
      birth_date: data.birth_date || null,
      reason: data.reason || null,
      status: data.status,
      private_notes: data.private_notes || null,
    };

    if (data.id) {
      const { error } = await context.supabase.from("clients").update(payload).eq("id", data.id);
      if (error) throw error;
      return { id: data.id };
    }

    const { data: created, error } = await context.supabase
      .from("clients")
      .insert({ ...payload, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw error;
    return { id: created.id };
  });

const NotesSchema = z.object({
  id: z.string().uuid(),
  private_notes: z.string().max(5000).nullable().optional(),
});

export const adminUpdateClientNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => NotesSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("clients")
      .update({ private_notes: data.private_notes || null })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminDeleteClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("clients").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
