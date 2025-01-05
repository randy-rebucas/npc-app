import Stripe from 'stripe';
import StripeAccount from '@/app/models/StripeAccount';
import { stripe } from '@/utils/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { NextResponse } from 'next/server';
import connect from '@/lib/db';

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
            limit: 100,
            expand: ['data.destination'],
        }, {
            stripeAccount: user.stripeAccountId
        });

        const formattedPayouts = payouts.data.map(payout => ({
            id: payout.id,
            amount: payout.amount,
            status: payout.status,
            arrival_date: payout.arrival_date,
            description: payout.description,
            bank_account: typeof payout.destination === 'string' 
                ? payout.destination.slice(-4) 
                : `****${(payout.destination as Stripe.BankAccount)?.last4 || ''}`,
        }));

        return NextResponse.json({ payouts: formattedPayouts });
    } catch (error) {
        console.error('Error fetching Stripe payouts:', error);
        return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 });
    }
} 