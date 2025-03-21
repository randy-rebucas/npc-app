import StripeAccount from "@/app/models/StripeAccount";
import { formatCurrency } from "@/lib/utils";
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

    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripeAccountId,
    });

    return NextResponse.json({
      balance: formatCurrency(
        balance.available[0].amount,
        balance.available[0].currency
      ),
    });
  } catch (error) {
    console.error("Error fetching Stripe balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
}
