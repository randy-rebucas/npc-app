import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Payment from "@/app/models/Payment";
import connect from "@/lib/db";

export async function GET() {
  console.log("GET request received");
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const nextPayout = await Payment.findOne({
      user: session.user.id,
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
