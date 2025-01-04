import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import StripeAccount from '@/app/models/StripeAccount';
import connect from "@/lib/db";
import { stripe } from '@/utils/stripe';

export async function POST() {
  try {
    const session = await getServerSession(authOptions); 
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    await connect();
    const account = await createStripeAccount();

    // Store Stripe account ID in MongoDB
    await StripeAccount.findOneAndUpdate(
      { user: userId },
      { stripeAccountId: account },
      { upsert: true, new: true }
    );

    const accountLink = await stripe.accountLinks.create({ 
      account: account,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/settings`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe connect error:', error);
    return NextResponse.json(
      { error: 'Failed to create Stripe connection' },
      { status: 500 }
    );
  }
}

async function createStripeAccount() {
  const account = await stripe.accounts.create({
    type: 'express',
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
  
  return account.id;
} 