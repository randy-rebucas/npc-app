import { NextResponse } from "next/server";
import User from "@/app/models/User";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");

    const users = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().setDate(new Date().getDate() - (Number(period) || 7))
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          signups: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          signups: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    return NextResponse.json({ users });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
