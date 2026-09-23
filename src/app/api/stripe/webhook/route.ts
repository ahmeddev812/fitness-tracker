import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing stripe signature or webhook secret" },
      { status: 400 }
    );
  }

  const payload = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.client_reference_id || session.metadata?.userId;
      const planKey = session.metadata?.planKey;
      // Subscription state is read live from Stripe via /api/stripe/status.
      console.info("[stripe] checkout completed", { userId, planKey, session: session.id });
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.info("[stripe] subscription event", {
        id: subscription.id,
        status: subscription.status,
      });
      break;
    }
    case "invoice.payment_failed": {
      console.warn("[stripe] payment failed", event.data.object.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
