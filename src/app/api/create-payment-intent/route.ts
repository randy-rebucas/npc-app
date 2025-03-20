import { NextResponse } from "next/server";
import Stripe from "stripe";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: "accept_a_payment",
        userId: claims?.id as string,
      },
    });

    return NextResponse.json({ 
        clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 }
    );
  }
}
