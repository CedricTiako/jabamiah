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

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }),
      POST: async ({ request }) => {
        const corsHeaders = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" } as const;

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders });
        }

        const parsed = ContactSchema.safeParse(body);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const { name, email, subject, message, locale, website } = parsed.data;

        // Honeypot: if filled, silently accept
        if (website && website.length > 0) {
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
        }

        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "contact@jabamiah.eu";
        const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Jabamiah <onboarding@resend.dev>";

        // Archive in DB (best-effort)
        try {
          const url = process.env.SUPABASE_URL;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (url && serviceKey) {
            const admin = createClient(url, serviceKey, {
              auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
            });
            const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? null;
            await admin.from("contact_messages").insert({
              name, email, subject: subject ?? null, message, locale: locale ?? null, ip_address: ip,
            });
          }
        } catch (err) {
          console.error("[contact] failed to archive", err);
        }

        if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
          console.error("[contact] missing email credentials");
          return new Response(JSON.stringify({ error: "Email service not configured" }), {
            status: 500,
            headers: corsHeaders,
          });
        }

        const subjectLine = subject?.trim() ? `[Jabamiah] ${subject.trim()}` : `[Jabamiah] Nouveau message de ${name}`;

        const html = `
<!doctype html>
<html><body style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:#f5f0e6; padding:24px;">
  <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:12px; padding:32px; border:1px solid #c4a661;">
    <h1 style="color:#2c3a24; font-family: 'Cormorant Garamond', serif; margin:0 0 16px;">Nouveau message du site Jabamiah</h1>
    <p style="margin:8px 0;"><strong>Nom :</strong> ${esc(name)}</p>
    <p style="margin:8px 0;"><strong>Email :</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
    ${subject ? `<p style="margin:8px 0;"><strong>Sujet :</strong> ${esc(subject)}</p>` : ""}
    ${locale ? `<p style="margin:8px 0;"><strong>Langue :</strong> ${esc(locale)}</p>` : ""}
    <hr style="border:none; border-top:1px solid #c4a661; margin:16px 0;" />
    <div style="white-space:pre-wrap; color:#2c3a24;">${esc(message)}</div>
  </div>
</body></html>`;

        try {
          const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": RESEND_API_KEY,
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: [TO_EMAIL],
              reply_to: email,
              subject: subjectLine,
              html,
            }),
          });
          if (!res.ok) {
            const text = await res.text();
            console.error("[contact] Resend error", res.status, text);
            return new Response(JSON.stringify({ error: "Send failed" }), { status: 502, headers: corsHeaders });
          }
        } catch (err) {
          console.error("[contact] send exception", err);
          return new Response(JSON.stringify({ error: "Send failed" }), { status: 502, headers: corsHeaders });
        }

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
      },
    },
  },
});
