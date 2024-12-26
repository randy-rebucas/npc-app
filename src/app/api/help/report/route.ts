import ReportedIssue from "@/app/models/ReportedIssue";
import connect from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();

    const reportedIssue = new ReportedIssue({
      email: session?.user?.email,
      ...data,
    });
    await reportedIssue.save();

    return NextResponse.json({ message: "Report submitted successfully" });
  } catch (error) {
    console.error("Error in report:", error);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
