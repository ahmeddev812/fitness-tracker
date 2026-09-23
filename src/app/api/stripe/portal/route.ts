import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getStripe, ensureStripeCustomer } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      returnUrl?: string;
    };

    const stripe = getStripe();
    const customerId = await ensureStripeCustomer(stripe, userId);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: body.returnUrl || `${appUrl}/profile`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to open billing portal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
