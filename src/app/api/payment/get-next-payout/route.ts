import { NextResponse } from "next/server";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import Payment from "@/app/models/Payment";
import connect from "@/lib/db";

export async function GET() {
  console.log("GET request received");
  try {
    await connect();
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const nextPayout = await Payment.findOne({
      user: claims?.id,
      status: "succeeded",
    })
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();

    console.log(nextPayout);
    if (!nextPayout) {
      return NextResponse.json(
        { error: "No next payout found" },
        { status: 404 }
      );
    }

    const nextPayoutDate = new Date(nextPayout.createdAt);
    nextPayoutDate.setDate(nextPayoutDate.getDate() + 14);

    return NextResponse.json({
      amount: nextPayout.amount,
      date: nextPayoutDate.toLocaleDateString(),
      currentPayout: nextPayout,
    });
  } catch (error) {
    console.error("Error fetching next payout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
