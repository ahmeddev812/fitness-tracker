import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripe, PLAN_LABELS, ensureStripeCustomer, type PlanKey } from "@/lib/stripe";
import type { SubscriptionStatus, UserPlan } from "@/types/billing";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripe();
    const customerId = await ensureStripeCustomer(stripe, userId);

    const [subs, methods, sessions] = await Promise.all([
      stripe.subscriptions.list({ customer: customerId, status: "all", limit: 10 }),
      stripe.paymentMethods.list({ customer: customerId, type: "card", limit: 10 }),
      stripe.checkout.sessions.list({ customer: customerId, limit: 20 }),
    ]);

    const activeSub = subs.data.find(
      (s) => s.status === "active" || s.status === "trialing"
    );

    let lifetimePaid = false;
    for (const session of sessions.data) {
      if (
        session.mode === "payment" &&
        session.payment_status === "paid" &&
        session.metadata?.planKey === "lifetime"
      ) {
        lifetimePaid = true;
        break;
      }
    }

    let plan: UserPlan = "free";
    if (lifetimePaid) {
      plan = "lifetime";
    } else if (activeSub) {
      const key = activeSub.metadata?.planKey as PlanKey | undefined;
      if (key === "pro_yearly") plan = "pro_yearly";
      else if (key === "pro_monthly") plan = "pro_monthly";
      else {
        // Fallback: inspect price interval if metadata missing
        const priceId = typeof activeSub.items.data[0]?.price?.id === "string"
          ? activeSub.items.data[0]?.price.id
          : "";
        if (priceId.includes("year")) plan = "pro_yearly";
        else plan = "pro_monthly";
      }
    }

    const paymentMethods = methods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand ?? "card",
      last4: pm.card?.last4 ?? "••••",
      expMonth: pm.card?.exp_month ?? 0,
      expYear: pm.card?.exp_year ?? 0,
    }));

    const itemPeriodEnd =
      activeSub?.items.data[0]?.current_period_end ?? null;

    const status: SubscriptionStatus = {
      plan,
      planLabel: plan === "free" ? "Free" : PLAN_LABELS[plan as PlanKey] ?? plan,
      isActive: plan !== "free",
      status: activeSub?.status ?? (lifetimePaid ? "complete" : null),
      currentPeriodEnd: itemPeriodEnd
        ? new Date(itemPeriodEnd * 1000).toISOString()
        : null,
      cancelAtPeriodEnd: activeSub?.cancel_at_period_end ?? false,
      customerId,
      paymentMethods,
      hasPaymentMethod: paymentMethods.length > 0,
    };

    return NextResponse.json(status);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
