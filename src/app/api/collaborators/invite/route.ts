import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import connect from "@/lib/db";
import { CollaborationRequest } from "@/app/models/Collaboration";
import User from "@/app/models/User";
import Notification from "@/app/models/Notification";
import { sendEmail } from "@/lib/email";

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
      const npUser = await User.findById(collaborationRequest.npUser);
      // Create a notification for the NP
      await Notification.create({
        user: npUser.id,
        title: "Collaboration Request Sent",
        message: "Your collaboration request has been sent",
        link: `/collaborators/request`,
      });

      // TODO: Send email to NP
      await sendEmail({
        to: npUser.email,
        subject: "Collaboration Request Sent",
        body: "Your collaboration request has been sent",
      });
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
