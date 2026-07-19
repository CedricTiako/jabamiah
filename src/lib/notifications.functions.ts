import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
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

export const adminGetNotificationSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);

    const [messages, reviews] = await Promise.all([
      context.supabase
        .from("contact_messages")
        .select("id, name, subject, created_at")
        .is("read_at", null)
        .order("created_at", { ascending: false })
        .limit(5),
      context.supabase
        .from("reviews")
        .select("id, author_name, created_at", { count: "exact" })
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
    if (messages.error) throw messages.error;
    if (reviews.error) throw reviews.error;

    const { count: unreadMessageCount, error: countError } = await context.supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .is("read_at", null);
    if (countError) throw countError;

    return {
      unreadMessages: unreadMessageCount ?? 0,
      recentMessages: messages.data ?? [],
      pendingReviews: reviews.count ?? 0,
      recentReviews: reviews.data ?? [],
    };
  });

export const adminMarkMessagesRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("contact_messages")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null);
    if (error) throw error;
    return { ok: true };
  });
