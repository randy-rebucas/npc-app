import StripeAccount from "@/app/models/StripeAccount";
import { getServerSession } from "next-auth";
import { stripe } from "@/utils/stripe";

import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import connect from "@/lib/db";

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

    const payouts = await stripe.payouts.list({
      stripeAccount: user.stripeAccountId,
    });
    console.log(payouts);
    return NextResponse.json({
      payouts: payouts,
    });
  } catch (error) {
    console.error("Error fetching Stripe payouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe payouts" },
      { status: 500 }
    );
  }
}
