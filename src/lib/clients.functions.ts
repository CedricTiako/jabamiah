import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";
import type { Database } from "../integrations/supabase/types";

const CLIENT_STATUSES = ["Actif", "Fidèle", "Nouveau", "Inactif"] as const;
type ClientStatus = (typeof CLIENT_STATUSES)[number];

// Automatic status rules (skipped for clients with status_locked = true):
// Nouveau -> Actif dès le 1er rendez-vous honoré, Actif -> Fidèle à partir de
// FIDELE_THRESHOLD séances honorées, et bascule en Inactif après
// INACTIVE_AFTER_MONTHS sans séance honorée et sans rendez-vous à venir.
const FIDELE_THRESHOLD = 5;
const INACTIVE_AFTER_MONTHS = 6;

type AppointmentStats = {
  honoredCount: number;
  lastHonoredAt: string | null;
  hasUpcoming: boolean;
};

function summarizeAppointments(
  appointments: { status: string; starts_at: string }[],
): AppointmentStats {
  const now = Date.now();
  const stats: AppointmentStats = { honoredCount: 0, lastHonoredAt: null, hasUpcoming: false };
  for (const a of appointments) {
    if (a.status === "Honoré") {
      stats.honoredCount += 1;
      if (!stats.lastHonoredAt || new Date(a.starts_at) > new Date(stats.lastHonoredAt)) {
        stats.lastHonoredAt = a.starts_at;
      }
    }
    if (
      (a.status === "Planifié" || a.status === "Confirmé") &&
      new Date(a.starts_at).getTime() >= now
    ) {
      stats.hasUpcoming = true;
    }
  }
  return stats;
}

function computeAutoStatus({
  honoredCount,
  lastHonoredAt,
  hasUpcoming,
}: AppointmentStats): ClientStatus {
  if (honoredCount === 0) return "Nouveau";

  const monthsSinceLastHonored = lastHonoredAt
    ? (Date.now() - new Date(lastHonoredAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
    : Infinity;
  if (monthsSinceLastHonored > INACTIVE_AFTER_MONTHS && !hasUpcoming) return "Inactif";
  if (honoredCount >= FIDELE_THRESHOLD) return "Fidèle";
  return "Actif";
}

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

export const adminListClients = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("clients")
      .select(
        "id, full_name, phone, email, city, birth_date, reason, status, status_locked, created_at",
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    const clients = data ?? [];
    if (clients.length === 0) return clients;

    const { data: appts, error: apptsError } = await context.supabase
      .from("appointments")
      .select("client_id, status, starts_at");
    if (apptsError) throw apptsError;

    const byClient = new Map<string, { status: string; starts_at: string }[]>();
    for (const a of appts ?? []) {
      const list = byClient.get(a.client_id) ?? [];
      list.push({ status: a.status, starts_at: a.starts_at });
      byClient.set(a.client_id, list);
    }

    const toPersist: { id: string; status: ClientStatus }[] = [];
    const result = clients.map((c) => {
      if (c.status_locked) return c;
      const computed = computeAutoStatus(summarizeAppointments(byClient.get(c.id) ?? []));
      if (computed !== c.status) toPersist.push({ id: c.id, status: computed });
      return { ...c, status: computed };
    });

    if (toPersist.length > 0) {
      await Promise.all(
        toPersist.map(({ id, status }) =>
          context.supabase.from("clients").update({ status }).eq("id", id),
        ),
      );
    }

    return result;
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
    if (!client || client.status_locked) return client;

    const { data: appts, error: apptsError } = await context.supabase
      .from("appointments")
      .select("status, starts_at")
      .eq("client_id", data.id);
    if (apptsError) throw apptsError;

    const computed = computeAutoStatus(summarizeAppointments(appts ?? []));
    if (computed !== client.status) {
      const { error: updateError } = await context.supabase
        .from("clients")
        .update({ status: computed })
        .eq("id", data.id);
      if (updateError) throw updateError;
      client.status = computed;
    }
    return client;
  });

export const adminUnlockClientStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("clients")
      .update({ status_locked: false })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
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
      // Changing the status via the form is treated as an explicit manual
      // override: it locks out the automatic recalculation from then on.
      const { data: existing, error: fetchError } = await context.supabase
        .from("clients")
        .select("status")
        .eq("id", data.id)
        .maybeSingle();
      if (fetchError) throw fetchError;
      const statusChanged = !!existing && existing.status !== data.status;

      const { error } = await context.supabase
        .from("clients")
        .update({ ...payload, ...(statusChanged ? { status_locked: true } : {}) })
        .eq("id", data.id);
      if (error) throw error;
      return { id: data.id };
    }

    const { data: created, error } = await context.supabase
      .from("clients")
      .insert({ ...payload, status_locked: data.status !== "Nouveau", created_by: context.userId })
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
