import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import type { Database } from "../../../integrations/supabase/types";

function getStripe(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SK_KEY;
  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SK_KEY");
  }
  return new Stripe(stripeSecretKey);
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase service role env");
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

function amountFromSession(session: Stripe.Checkout.Session): number | null {
  if (typeof session.amount_total === "number") {
    return session.amount_total / 100;
  }
  const metadataAmount = Number(session.metadata?.amount_eur ?? NaN);
  return Number.isFinite(metadataAmount) && metadataAmount > 0 ? metadataAmount : null;
}

export const Route = createFileRoute("/api/public/donations/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
          console.error("[donations/webhook] missing STRIPE_WEBHOOK_SECRET");
          return new Response("Webhook not configured", { status: 500 });
        }

        const signature = request.headers.get("stripe-signature");
        if (!signature) {
          return new Response("Missing stripe-signature", { status: 400 });
        }

        const rawBody = await request.text();

        let event: Stripe.Event;
        try {
          event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
        } catch (error) {
          console.error("[donations/webhook] signature verification failed", error);
          return new Response("Invalid signature", { status: 400 });
        }

        if (
          event.type === "checkout.session.completed" ||
          event.type === "checkout.session.async_payment_succeeded"
        ) {
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.payment_status !== "paid") {
            return new Response("Ignored: session not paid", { status: 200 });
          }

          const reference = session.id;
          const amount = amountFromSession(session);
          if (!amount || amount <= 0) {
            console.error("[donations/webhook] invalid amount", { sessionId: session.id });
            return new Response("Invalid amount", { status: 400 });
          }

          const supabase = getSupabaseAdmin();

          const { data: existing, error: existingError } = await supabase
            .from("payments")
            .select("id")
            .eq("reference", reference)
            .maybeSingle();

          if (existingError) {
            console.error("[donations/webhook] failed to check existing payment", existingError);
            return new Response("Database read error", { status: 500 });
          }

          if (existing?.id) {
            return new Response("Already processed", { status: 200 });
          }

          const donorName = session.customer_details?.name ?? null;
          const paymentDate = new Date(
            (session.created ?? Math.floor(Date.now() / 1000)) * 1000,
          ).toISOString();

          const { error: insertError } = await supabase.from("payments").insert({
            payment_date: paymentDate,
            amount,
            donor_name: donorName,
            method: "stripe_card",
            reference,
            note: session.payment_intent
              ? `Stripe payment_intent: ${session.payment_intent}`
              : "Stripe checkout",
            // Keep compatibility with existing DB constraint (manual|paypal).
            source: "paypal",
          });

          if (insertError) {
            console.error("[donations/webhook] failed to insert payment", insertError);
            return new Response("Database write error", { status: 500 });
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
