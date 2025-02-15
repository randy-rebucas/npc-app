import { NextResponse } from "next/server";
import StripeAccount from "@/app/models/StripeAccount";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import connect from "@/lib/db";
import { stripe } from "@/utils/stripe";

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

    // Fetch account details from Stripe
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    // console.log(account);
    return NextResponse.json({
      account: {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
      },
    });
  } catch (error) {
    console.error("Error fetching Stripe status:", error);
    return NextResponse.json(
      { error: "Failed to fetch Stripe status" },
      { status: 500 }
    );
  }
}
