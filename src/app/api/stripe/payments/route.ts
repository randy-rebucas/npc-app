import StripeAccount from "@/app/models/StripeAccount";
import { stripe } from "@/utils/stripe";
import { getServerSession } from "next-auth";
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

    const paymentIntents = await stripe.paymentIntents.list(
      {
        limit: 100,
      },
      {
        stripeAccount: user.stripeAccountId,
      }
    );

    const payments = paymentIntents.data.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      created: payment.created,
      customer: payment.customer as string,
    }));

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching Stripe payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
