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

const PAYMENT_COLUMNS =
  "id, payment_date, amount, donor_name, method, reference, note, source, status, stripe_session_id, stripe_payment_intent_id, client_id";

export const adminListPayments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("payments")
      .select(PAYMENT_COLUMNS)
      .order("payment_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminListPaymentsByClient = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { client_id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("payments")
      .select(PAYMENT_COLUMNS)
      .eq("client_id", data.client_id)
      .order("payment_date", { ascending: false });
    if (error) throw error;
    return rows ?? [];
  });

const PAYMENT_STATUSES = ["pending", "succeeded", "failed", "refunded"] as const;

const CreateSchema = z.object({
  payment_date: z.string().min(1),
  amount: z.coerce.number().positive(),
  donor_name: z.string().max(200).nullable().optional(),
  method: z.string().max(60).nullable().optional(),
  reference: z.string().max(120).nullable().optional(),
  note: z.string().max(1000).nullable().optional(),
  client_id: z.string().uuid().nullable().optional(),
  status: z.enum(PAYMENT_STATUSES).optional(),
});

export const adminCreatePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => CreateSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: created, error } = await context.supabase
      .from("payments")
      .insert({
        payment_date: data.payment_date,
        amount: data.amount,
        donor_name: data.donor_name || null,
        method: data.method || null,
        reference: data.reference || null,
        note: data.note || null,
        client_id: data.client_id || null,
        status: data.status ?? "succeeded",
        source: "manual",
        created_by: context.userId,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: created.id };
  });

const UpdateSchema = CreateSchema.extend({ id: z.string().uuid() });

export const adminUpdatePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpdateSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("payments")
      .update({
        payment_date: data.payment_date,
        amount: data.amount,
        donor_name: data.donor_name || null,
        method: data.method || null,
        reference: data.reference || null,
        note: data.note || null,
        client_id: data.client_id || null,
        status: data.status ?? "succeeded",
      })
      .eq("id", data.id);
    if (error) throw error;
    return { id: data.id };
  });

export const adminDeletePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("payments").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
