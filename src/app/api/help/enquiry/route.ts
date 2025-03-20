import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Enquiry from "@/app/models/Enquiry";

export async function POST(req: Request) {
  try {
    await connect();

    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();

    const enquiry = new Enquiry({
      email: claims?.email,
      subject: data.subject,
      message: data.message,
    });
    await enquiry.save();

    return NextResponse.json({ message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Error in enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
