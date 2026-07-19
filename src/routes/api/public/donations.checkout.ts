import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import Stripe from "stripe";
import type { Database } from "../../../integrations/supabase/types";

const CheckoutSchema = z.object({
  amount: z.coerce.number().positive().max(5000),
});

function getOrigin(request: Request): string {
  const requestUrl = new URL(request.url);
  return `${requestUrl.protocol}//${requestUrl.host}`;
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient<Database>(url, serviceRoleKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const Route = createFileRoute("/api/public/donations/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const headers = { "Content-Type": "application/json" } as const;

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers,
          });
        }

        const parsed = CheckoutSchema.safeParse(body);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
            {
              status: 400,
              headers,
            },
          );
        }

        const stripeSecretKey = process.env.STRIPE_SK_KEY;
        if (!stripeSecretKey) {
          console.error("[donations/checkout] missing STRIPE_SK_KEY");
          return new Response(JSON.stringify({ error: "Service not configured" }), {
            status: 500,
            headers,
          });
        }

        const stripe = new Stripe(stripeSecretKey);
        const unitAmount = Math.round(parsed.data.amount * 100);
        const siteUrl = process.env.SITE_URL || getOrigin(request);

        try {
          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            submit_type: "donate",
            line_items: [
              {
                quantity: 1,
                price_data: {
                  currency: "eur",
                  unit_amount: unitAmount,
                  product_data: {
                    name: "Don solidaire Jabamiah",
                    description: "Contribution libre pour soutenir la mission solidaire Jabamiah.",
                  },
                },
              },
            ],
            metadata: {
              source: "public_donation",
              amount_eur: parsed.data.amount.toFixed(2),
            },
            success_url: `${siteUrl}/don?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/don?payment=cancel`,
          });

          const supabase = getSupabaseAdmin();
          if (supabase) {
            const { error: insertError } = await supabase.from("payments").insert({
              payment_date: new Date().toISOString(),
              amount: parsed.data.amount,
              method: "stripe_card",
              source: "stripe",
              status: "pending",
              reference: session.id,
              stripe_session_id: session.id,
              note: "Stripe checkout créé — en attente de paiement",
            });
            // Don't block the donor's checkout on a tracking-row failure; the webhook
            // will still insert the payment on success even if this pending row is missing.
            if (insertError) {
              console.error("[donations/checkout] failed to record pending payment", insertError);
            }
          }

          return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers,
          });
        } catch (error) {
          console.error("[donations/checkout] stripe error", error);
          return new Response(JSON.stringify({ error: "Checkout creation failed" }), {
            status: 500,
            headers,
          });
        }
      },
    },
  },
});
