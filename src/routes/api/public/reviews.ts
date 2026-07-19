import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const ReviewSchema = z.object({
  author_name: z.string().trim().min(2).max(100),
  author_email: z.string().trim().email().max(255).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(10).max(2000),
  // honeypot - must be empty
  website: z.string().max(0).optional().nullable(),
});

export const Route = createFileRoute("/api/public/reviews")({
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

        const parsed = ReviewSchema.safeParse(body);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
            {
              status: 400,
              headers: corsHeaders,
            },
          );
        }

        const { author_name, author_email, rating, body: reviewBody, website } = parsed.data;

        // Honeypot: if filled, silently accept without doing anything
        if (website && website.length > 0) {
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
        }

        const url = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !serviceKey) {
          console.error("[reviews] missing Supabase service role env");
          return new Response(JSON.stringify({ error: "Service not configured" }), {
            status: 500,
            headers: corsHeaders,
          });
        }

        const admin = createClient(url, serviceKey, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        const { error } = await admin.from("reviews").insert({
          author_name,
          author_email: author_email || null,
          rating,
          body: reviewBody,
          status: "pending",
        });
        if (error) {
          console.error("[reviews] insert failed", error);
          return new Response(JSON.stringify({ error: "Submission failed" }), {
            status: 500,
            headers: corsHeaders,
          });
        }

        try {
          const { sendOwnerNotification, newReviewPendingEmail } =
            await import("../../../lib/email.server");
          await sendOwnerNotification({
            subject: `[Jabamiah] Nouvel avis de ${author_name} à modérer`,
            html: newReviewPendingEmail(author_name, rating, reviewBody),
          });
        } catch (err) {
          console.error("[reviews] owner notification failed", err);
        }

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
      },
    },
  },
});
