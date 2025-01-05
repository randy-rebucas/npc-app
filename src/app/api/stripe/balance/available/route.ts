import StripeAccount from "@/app/models/StripeAccount";
import { getServerSession } from "next-auth";
import { stripe } from "@/utils/stripe";

import { NextResponse } from "next/server";
import connect from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

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
