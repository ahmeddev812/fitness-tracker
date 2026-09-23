import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripe, PLANS, ensureStripeCustomer, type PlanKey } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      plan?: PlanKey | "pro" | "lifetime";
      interval?: "monthly" | "yearly";
    };

    let planKey: PlanKey;
    if (body.plan === "lifetime") {
      planKey = "lifetime";
    } else if (body.plan === "pro") {
      planKey = body.interval === "yearly" ? "pro_yearly" : "pro_monthly";
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = PLANS[planKey];
    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    const customerId = await ensureStripeCustomer(stripe, userId);

    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      client_reference_id: userId,
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: plan.currency,
            product_data: { name: plan.name },
            unit_amount: plan.amount,
            ...(plan.mode === "subscription" && plan.interval
              ? { recurring: { interval: plan.interval } }
              : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      metadata: { userId, planKey },
      ...(plan.mode === "subscription"
        ? { subscription_data: { metadata: { userId, planKey } } }
        : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
