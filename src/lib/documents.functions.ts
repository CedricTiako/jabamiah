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

const DOCUMENT_COLUMNS = "id, client_id, title, doc_type, description, storage_path, mime_type, file_size, created_at";

export const adminListDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("documents")
      .select(`${DOCUMENT_COLUMNS}, clients(full_name)`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const adminListDocumentsByClient = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { client_id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("documents")
      .select(DOCUMENT_COLUMNS)
      .eq("client_id", data.client_id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return rows ?? [];
  });

const CreateSchema = z.object({
  client_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(200),
  doc_type: z.string().max(60).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  storage_path: z.string().min(1),
  mime_type: z.string().max(100).nullable().optional(),
  file_size: z.coerce.number().int().min(0).nullable().optional(),
});

export const adminCreateDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => CreateSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: created, error } = await context.supabase
      .from("documents")
      .insert({
        client_id: data.client_id || null,
        title: data.title,
        doc_type: data.doc_type || null,
        description: data.description || null,
        storage_path: data.storage_path,
        mime_type: data.mime_type || null,
        file_size: data.file_size ?? null,
        created_by: context.userId,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: created.id };
  });

export const adminDeleteDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: doc, error: getErr } = await context.supabase
      .from("documents")
      .select("storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (getErr) throw getErr;
    if (doc) {
      await context.supabase.storage.from("client-documents").remove([doc.storage_path]);
    }
    const { error } = await context.supabase.from("documents").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminGetDocumentSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { storage_path: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: signed, error } = await context.supabase.storage
      .from("client-documents")
      .createSignedUrl(data.storage_path, 300);
    if (error) throw error;
    return { url: signed.signedUrl };
  });
