import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import connect from "@/lib/db";
import { CollaborationRequest } from "@/app/models/Collaboration";
import User from "@/app/models/User";

export async function POST(request: Request) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { email } = await request.json();

    const npUser = await User.findOne({ email: email });
    if (!npUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const collaborationRequest = new CollaborationRequest({
        npUser: npUser.id,
        physicianUser: session.user.id,
        status: 'pending',
        requestedAt: new Date(),
        message: 'Invitation sent',
    });
    await collaborationRequest.save();

    if (collaborationRequest) {
      // TODO: Send email to NP
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inviting collaborator:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
