import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Enquiry from "@/app/models/Enquiry";

export async function POST(req: Request) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();

    const enquiry = new Enquiry({
      email: session?.user?.email,
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
