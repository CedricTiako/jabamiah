import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().min(10).max(5000),
  locale: z.string().trim().max(5).optional().nullable(),
  // honeypot - must be empty
  website: z.string().max(0).optional().nullable(),
});

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
      POST: async ({ request }) => {
        const corsHeaders = {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        } as const;

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const parsed = ContactSchema.safeParse(body);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        const { name, email, subject, message, locale, website } = parsed.data;

        // Honeypot: if filled, silently accept without doing anything
        if (website && website.length > 0) {
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
        }

        const url = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !serviceKey) {
          console.error("[contact] missing Supabase service role env");
          return new Response(JSON.stringify({ error: "Service not configured" }), {
            status: 500,
            headers: corsHeaders,
          });
        }

        const admin = createClient(url, serviceKey, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        const ip =
          request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? null;
        const { error } = await admin.from("contact_messages").insert({
          name,
          email,
          subject: subject ?? null,
          message,
          locale: locale ?? null,
          ip_address: ip,
        });
        if (error) {
          console.error("[contact] insert failed", error);
          return new Response(JSON.stringify({ error: "Submission failed" }), {
            status: 500,
            headers: corsHeaders,
          });
        }

        try {
          const { sendOwnerNotification, newContactMessageEmail } =
            await import("../../../lib/email.server");
          await sendOwnerNotification({
            subject: subject?.trim()
              ? `[Jabamiah] ${subject.trim()}`
              : `[Jabamiah] Nouveau message de ${name}`,
            html: newContactMessageEmail(name, email, subject ?? null, message),
            replyTo: email,
          });
        } catch (err) {
          console.error("[contact] owner notification failed", err);
        }

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
      },
    },
  },
});
