import ReportedIssue from "@/app/models/ReportedIssue";
import connect from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connect();

    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();

    const reportedIssue = new ReportedIssue({
      email: claims?.email,
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
