import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { ActiveCollaboration } from "@/app/models/Collaboration";
import connect from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connect();

    const activeCollaborations = await ActiveCollaboration.find({
      physicianUser: session.user.id,
      status: "active",
    }).populate({
      path: "npUser",
      model: "User",
      select: "-password",
    });

    return NextResponse.json(activeCollaborations);
    
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
