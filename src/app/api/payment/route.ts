import Payment from "@/app/models/Payment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payment = await Payment.find({ user: session.user.id });

    const totalEarnings = payment.reduce((acc, curr) => acc + curr.amount, 0);
    console.log(totalEarnings);

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error in payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
