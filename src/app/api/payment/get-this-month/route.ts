import { NextResponse } from "next/server";
import Payment from "@/app/models/Payment"; // You'll need to create this model
import connect from "@/lib/db"; // Ensure you have this connection utility

export async function GET() {
  try {
    await connect();

    // Get the current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Aggregate payments for this month
    const monthlyStats = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          amount: { $sum: '$amount' },
          collaboratorCount: { $addToSet: '$collaboratorId' }
        }
      },
      {
        $project: {
          _id: 0,
          amount: 1,
          collaboratorCount: { $size: '$collaboratorId' }
        }
      }
    ]);

    const result = monthlyStats[0] || { amount: 0, collaboratorCount: 0 };
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching monthly earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly earnings' },
      { status: 500 }
    );
  }
}
