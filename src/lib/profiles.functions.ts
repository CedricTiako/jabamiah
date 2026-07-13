import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";

// No assertAdmin here on purpose: profiles are per-user, gated by RLS
// (auth.uid() = user_id), not by the admin role.

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("user_id, full_name, phone, title, bio, avatar_url, notification_prefs")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  });

const UpsertSchema = z.object({
  full_name: z.string().max(200).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  title: z.string().max(120).nullable().optional(),
  bio: z.string().max(2000).nullable().optional(),
  avatar_url: z.string().max(500).nullable().optional(),
  notification_prefs: z.record(z.string(), z.boolean()).optional(),
});

export const upsertMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpsertSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("profiles").upsert({
      user_id: context.userId,
      full_name: data.full_name ?? null,
      phone: data.phone ?? null,
      title: data.title ?? null,
      bio: data.bio ?? null,
      avatar_url: data.avatar_url ?? null,
      ...(data.notification_prefs ? { notification_prefs: data.notification_prefs } : {}),
    });
    if (error) throw error;
    return { ok: true };
  });
