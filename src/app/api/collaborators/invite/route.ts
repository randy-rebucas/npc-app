import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import connect from "@/lib/db";
import { CollaborationRequest } from "@/app/models/Collaboration";
import User, { UserRole, UserSubmissionStatus } from "@/app/models/User";
import Notification from "@/app/models/Notification";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }
    const { email } = await request.json();

    const npUser = await User.findOne({ email: email });

    if (!npUser) {
      return NextResponse.json(
        { success: false, message: "User not found" }, 
        { status: 404 }
      );
    }

    if (npUser.role !== UserRole.NURSE_PRACTITIONER) {
      return NextResponse.json(
        { success: false, message: "User is not a NP" }, 
        { status: 400 }
      );
    }

    if (npUser.submissionStatus !== UserSubmissionStatus.APPROVED) {  
      return NextResponse.json(
        { success: false, message: "User is not approved" }, 
        { status: 400 }
      );
    }

    // Check for existing collaboration request
    const existingRequest = await CollaborationRequest.findOne({
      npUser: npUser.id,
      physicianUser: session.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, message: "A pending collaboration request already exists" },
        { status: 400 }
      );
    }

    const collaborationRequest = new CollaborationRequest({
        npUser: npUser.id,
        physicianUser: session.user.id,
        status: 'pending', 
        requestedAt: new Date(),
        message: 'Collaboration invitation received',
    });
    await collaborationRequest.save();

    // Create a notification for the NP
    await Notification.create({
      user: npUser.id,
      title: "New Collaboration Invitation",
      message: `You have received a collaboration invitation from Dr. ${session.user.name}`,
      link: `/collaborators/request`,
    });

    // Send email to NP
    await sendEmail({
      to: npUser.email,
      subject: "New Collaboration Invitation",
      body: `You have received a collaboration invitation from Dr. ${session.user.name}. Please log in to your account to review and respond to this request.`,
    });

    return NextResponse.json({ success: true, message: "Invitation sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
