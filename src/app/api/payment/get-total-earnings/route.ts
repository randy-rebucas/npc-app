import { NextResponse } from "next/server";
import Payment from "@/app/models/Payment";
import connect from "@/lib/db";

export async function GET() {
  try {
    await connect();
    
    // Get date for 12 months ago
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1); // Start from first day of the month

    const result = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          monthlyAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    console.log(result);

    // Format the result into a 12-month array
    const monthlyEarnings = Array(12).fill(0);
    const currentMonth = new Date().getMonth();
    
    result.forEach((item) => {
      const monthIndex = (item._id.month - 1 + 12 - currentMonth) % 12;
      monthlyEarnings[monthIndex] = item.monthlyAmount;
    });

    const totalAmount = monthlyEarnings.reduce((sum, amount) => sum + amount, 0);

    return NextResponse.json({
      amount: totalAmount,
      monthlyData: monthlyEarnings,
    });
  } catch (error) {
    console.error('Error fetching total earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch total earnings' },
      { status: 500 }
    );
  }
}
