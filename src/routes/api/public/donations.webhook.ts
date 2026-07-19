import { createFileRoute } from "@tanstack/react-router";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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

function paymentIntentId(value: Stripe.Checkout.Session["payment_intent"]): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function markSucceeded(supabase: SupabaseClient<Database>, session: Stripe.Checkout.Session) {
  const amount = amountFromSession(session);
  if (!amount || amount <= 0) {
    console.error("[donations/webhook] invalid amount", { sessionId: session.id });
    return;
  }

  const donorName = session.customer_details?.name ?? null;
  const intentId = paymentIntentId(session.payment_intent);
  const paymentDate = new Date(
    (session.created ?? Math.floor(Date.now() / 1000)) * 1000,
  ).toISOString();
  const note = intentId ? `Stripe payment_intent: ${intentId}` : "Stripe checkout";

  const { data: existing, error: existingError } = await supabase
    .from("payments")
    .select("id, status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existingError) {
    console.error("[donations/webhook] failed to check existing payment", existingError);
    return;
  }

  if (existing) {
    if (existing.status === "succeeded") return; // already processed
    const { error } = await supabase
      .from("payments")
      .update({
        status: "succeeded",
        amount,
        donor_name: donorName,
        stripe_payment_intent_id: intentId,
        note,
      })
      .eq("id", existing.id);
    if (error) console.error("[donations/webhook] failed to update payment", error);
    return;
  }

  // No pending row (e.g. it was created before this tracking was added, or the
  // insert at checkout time failed) — insert the completed payment directly.
  const { error } = await supabase.from("payments").insert({
    payment_date: paymentDate,
    amount,
    donor_name: donorName,
    method: "stripe_card",
    source: "stripe",
    status: "succeeded",
    reference: session.id,
    stripe_session_id: session.id,
    stripe_payment_intent_id: intentId,
    note,
  });
  if (error) console.error("[donations/webhook] failed to insert payment", error);
}

async function markSessionFailed(supabase: SupabaseClient<Database>, sessionId: string) {
  const { error } = await supabase
    .from("payments")
    .update({ status: "failed" })
    .eq("stripe_session_id", sessionId)
    .eq("status", "pending");
  if (error) console.error("[donations/webhook] failed to mark payment failed", error);
}

async function markRefunded(supabase: SupabaseClient<Database>, charge: Stripe.Charge) {
  const intentId = paymentIntentId(
    charge.payment_intent as Stripe.Checkout.Session["payment_intent"],
  );
  if (!intentId) return;

  // `charge.refunded` also fires for partial refunds; only Stripe's own `refunded`
  // flag tells us the charge is now fully refunded. A partial refund is logged but
  // doesn't flip the payment to "refunded" (the donation amount itself didn't fully bounce).
  if (!charge.refunded) {
    console.warn("[donations/webhook] partial refund, status left unchanged", {
      paymentIntentId: intentId,
      amountRefunded: charge.amount_refunded,
      amount: charge.amount,
    });
    return;
  }

  const { error } = await supabase
    .from("payments")
    .update({ status: "refunded" })
    .eq("stripe_payment_intent_id", intentId);
  if (error) console.error("[donations/webhook] failed to mark payment refunded", error);
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

        const supabase = getSupabaseAdmin();

        switch (event.type) {
          case "checkout.session.completed":
          case "checkout.session.async_payment_succeeded": {
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.payment_status === "paid") {
              await markSucceeded(supabase, session);
            }
            break;
          }
          case "checkout.session.expired":
          case "checkout.session.async_payment_failed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await markSessionFailed(supabase, session.id);
            break;
          }
          case "charge.refunded": {
            const charge = event.data.object as Stripe.Charge;
            await markRefunded(supabase, charge);
            break;
          }
          default:
            break;
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
