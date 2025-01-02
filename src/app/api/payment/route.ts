import Payment from "@/app/models/Payment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const session = await getServerSession(authOptions); 
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
         
        const body = await req.json();
        const paymentIntent = body.paymentIntent;
        const paymentIntentClientSecret = body.paymentIntentClientSecret;
        const redirectStatus = body.redirectStatus;

        const payment = await Payment.create({
            paymentIntentId: paymentIntent,
            clientSecret: paymentIntentClientSecret,
            status: redirectStatus,
            user: session.user.id
        });

        console.log(payment);

        return NextResponse.json(payment);
    } catch (error) {
        console.error("Error in payment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

