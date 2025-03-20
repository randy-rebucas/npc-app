import Payment from "@/app/models/Payment";
import { NextResponse } from "next/server";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payment = await Payment.find({ user: claims?.id });

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
