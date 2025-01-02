import { NextResponse } from "next/server";
import Stripe from "stripe";
import StripeAccount from "@/app/models/StripeAccount";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connect from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    await connect();
    const user = await StripeAccount.findOne({ user: userId });

    if (user?.stripeAccountId) {
      // Deauthorize the account with Stripe
      await stripe.accounts.del(user.stripeAccountId);

      // Remove Stripe account ID from database
      await StripeAccount.findOneAndUpdate(
        { user: userId },
        { $unset: { stripeAccountId: "" } },
        { new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Stripe:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Stripe account" },
      { status: 500 }
    );
  }
}
