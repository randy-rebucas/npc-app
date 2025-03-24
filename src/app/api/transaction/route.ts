import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import Transaction from "@/app/models/Transaction";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function POST(req: NextRequest) {

    try {
        const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
        if (!isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
         
        const body = await req.json();
        const paymentIntent = body.paymentIntent;
        const paymentIntentClientSecret = body.paymentIntentClientSecret;
        const redirectStatus = body.redirectStatus;

        const transaction = await Transaction.create({
            paymentIntentId: paymentIntent,
            clientSecret: paymentIntentClientSecret,
            status: redirectStatus,
            user: claims?.id
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error("Error in payment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
