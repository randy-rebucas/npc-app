import StripeAccount from "@/app/models/StripeAccount";
import { stripe } from "@/utils/stripe";

import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = claims?.id;

    await connect();

    const user = await StripeAccount.findOne({ user: userId });

    if (!user?.stripeAccountId) {
      return NextResponse.json({ account: null });
    }

    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripeAccountId,
    });

    return NextResponse.json({
      available: balance.available,
    });
  } catch (error) {
    console.error("Error fetching Stripe earnings:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe earnings" },
      { status: 500 }
    );
  }
}
