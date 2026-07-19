import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";
import type { Database } from "../integrations/supabase/types";

const APPOINTMENT_STATUSES = ["Planifié", "Confirmé", "Annulé", "Honoré", "No-show"] as const;

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

export const adminListAppointments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("appointments")
      .select(
        "id, client_id, starts_at, duration_minutes, session_type, location, status, note, clients(full_name)",
      )
      .order("starts_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

const UpsertSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  client_id: z.string().uuid(),
  starts_at: z.string().min(1),
  duration_minutes: z.coerce.number().int().min(5).max(600),
  session_type: z.string().max(60).nullable().optional(),
  location: z.string().max(60).nullable().optional(),
  note: z.string().max(2000).nullable().optional(),
});

export const adminUpsertAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      client_id: data.client_id,
      starts_at: data.starts_at,
      duration_minutes: data.duration_minutes,
      session_type: data.session_type || null,
      location: data.location || null,
      note: data.note || null,
    };

    const emailDetails = {
      startsAt: payload.starts_at,
      sessionType: payload.session_type,
      durationMinutes: payload.duration_minutes,
      location: payload.location,
      note: payload.note,
    };

    if (data.id) {
      const { error } = await context.supabase
        .from("appointments")
        .update(payload)
        .eq("id", data.id);
      if (error) throw error;

      const { data: client } = await context.supabase
        .from("clients")
        .select("full_name, email")
        .eq("id", data.client_id)
        .maybeSingle();
      if (client?.email) {
        const { sendClientEmail, appointmentUpdatedEmail } = await import("./email.server");
        await sendClientEmail({
          to: client.email,
          subject: "Votre rendez-vous a été modifié — Jabamiah",
          html: appointmentUpdatedEmail(client.full_name, emailDetails),
        });
      }

      return { id: data.id };
    }

    const { data: created, error } = await context.supabase
      .from("appointments")
      .insert({ ...payload, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw error;

    const { data: client } = await context.supabase
      .from("clients")
      .select("full_name, email")
      .eq("id", data.client_id)
      .maybeSingle();
    if (client?.email) {
      const { sendClientEmail, appointmentConfirmedEmail } = await import("./email.server");
      await sendClientEmail({
        to: client.email,
        subject: "Confirmation de votre rendez-vous — Jabamiah",
        html: appointmentConfirmedEmail(client.full_name, emailDetails),
      });
    }

    return { id: created.id };
  });

const StatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(APPOINTMENT_STATUSES),
});

export const adminUpdateAppointmentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => StatusSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw error;

    const { data: appointment } = await context.supabase
      .from("appointments")
      .select("starts_at, clients(full_name, email)")
      .eq("id", data.id)
      .maybeSingle();
    const client = appointment?.clients as { full_name: string; email: string | null } | null;
    if (appointment && client?.email) {
      const { sendClientEmail, appointmentStatusEmail } = await import("./email.server");
      await sendClientEmail({
        to: client.email,
        subject: "Mise à jour de votre rendez-vous — Jabamiah",
        html: appointmentStatusEmail(client.full_name, appointment.starts_at, data.status),
      });
    }

    return { ok: true };
  });

export const adminDeleteAppointment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("appointments").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
