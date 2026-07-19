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

export interface PublicSettings {
  paypal_client_id: string;
  donation_amounts: number[];
  legal_editor_name: string;
  legal_editor_status: string;
  legal_editor_siret: string;
  legal_editor_address: string;
  legal_publication_director: string;
}

function parseSettings(
  rows: Array<{ key: string; value: string | null }> | null,
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const row of rows ?? []) {
    map[row.key] = row.value ?? "";
  }
  return map;
}

export const getPublicSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicSettings> => {
    const sb = getPublicClient();
    const { data } = await sb.from("site_settings" as never).select("key, value");
    const map = parseSettings(
      data as unknown as Array<{ key: string; value: string | null }> | null,
    );

    let amounts: number[] = [5, 10, 20, 50];
    try {
      const parsed = JSON.parse(map.donation_amounts ?? "[5,10,20,50]");
      if (Array.isArray(parsed))
        amounts = (parsed as unknown[]).map(Number).filter((n) => !isNaN(n as number));
    } catch (error) {
      void error;
    }
    return {
      paypal_client_id: map.paypal_client_id ?? "",
      donation_amounts: amounts,
      legal_editor_name: map.legal_editor_name ?? "",
      legal_editor_status: map.legal_editor_status ?? "",
      legal_editor_siret: map.legal_editor_siret ?? "",
      legal_editor_address: map.legal_editor_address ?? "",
      legal_publication_director: map.legal_publication_director ?? "",
    };
  },
);

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Record<string, string>> => {
    await assertAdmin(context);
    const { data } = await context.supabase.from("site_settings" as never).select("key, value");
    return parseSettings(data as unknown as Array<{ key: string; value: string | null }> | null);
  });

export const adminUpdateSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { key: string; value: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("site_settings" as never).upsert({
      key: data.key,
      value: data.value,
      updated_at: new Date().toISOString(),
    } as never);
    if (error) throw error;
    return { success: true };
  });
