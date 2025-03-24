import { NextResponse } from "next/server";
import { ActiveCollaboration } from "@/app/models/Collaboration";
import connect from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connect();

    const activeCollaborations = await ActiveCollaboration.find({
      physicianUser: claims?.id,
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
