import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeClient = new Stripe(key, {
      appInfo: { name: "PULSE Fitness", version: "0.1.0" },
    });
  }
  return stripeClient;
}

export const PLANS = {
  pro_monthly: {
    name: "PULSE Pro (Monthly)",
    amount: 29900,
    currency: "inr",
    mode: "subscription" as const,
    interval: "month",
  },
  pro_yearly: {
    name: "PULSE Pro (Yearly)",
    amount: 199900,
    currency: "inr",
    mode: "subscription" as const,
    interval: "year",
  },
  lifetime: {
    name: "PULSE Lifetime",
    amount: 499900,
    currency: "inr",
    mode: "payment" as const,
    interval: null,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export const PLAN_LABELS: Record<PlanKey, string> = {
  pro_monthly: "Pro Monthly",
  pro_yearly: "Pro Yearly",
  lifetime: "Lifetime",
};

/** Find or create a Stripe customer tagged with the Clerk userId. */
export async function ensureStripeCustomer(
  stripe: Stripe,
  userId: string
): Promise<string> {
  const escaped = userId.replace(/['\\]/g, "\\$&");
  const result = await stripe.customers.search({
    query: `metadata['userId']:'${escaped}'`,
    limit: 1,
  });
  const existing = result.data[0];
  if (existing) return existing.id;

  const customer = await stripe.customers.create({
    metadata: { userId },
  });
  return customer.id;
}
