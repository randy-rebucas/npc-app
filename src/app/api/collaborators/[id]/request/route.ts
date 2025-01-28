import { NextResponse } from "next/server";
import connect from "@/lib/db";
import {
  CollaborationRequest,
  CollaborationRequestStatus,
} from "@/app/models/Collaboration";
import Notification from "@/app/models/Notification";
import User, { UserSubmissionStatus } from "@/app/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { sendEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the Physician ID from params
    const { id } = await params;

    await connect();

    // check if the physician is approved
    const physician = await User.findById(id);
    if (!physician || physician.submissionStatus !== UserSubmissionStatus.APPROVED) {
      return NextResponse.json(
        { success: false, message: "Physician is not approved. Submission status: " + physician.submissionStatus },
        { status: 400 }
      );
    }

    // Check if the collaboration request already exists
    const collaborationRequest = await CollaborationRequest.findOne({
      physicianUser: id,
      npUser: session.user.id,
    });
    if (collaborationRequest) {
      return NextResponse.json(
        { success: false, message: "Collaboration request already exists" },
        { status: 400 }
      );
    }

    // Create a new collaboration request
    const newCollaborationRequest = new CollaborationRequest({
      npUser: session.user.id,
      physicianUser: id,
      status: CollaborationRequestStatus.PENDING,
      responseMessage: "Collaboration request received",
      respondedAt: new Date(),
    });
    const savedCollaborationRequest = await newCollaborationRequest.save();

    if (!savedCollaborationRequest) {
      return NextResponse.json(
        { success: false, message: "Failed to save collaboration request" },
        { status: 500 }
      );
    }

    const physicianUser = await User.findById(savedCollaborationRequest.physicianUser);
    if (!physicianUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a notification for the NP
    await Notification.create({
      user: physicianUser.id,
      title: "Collaboration Request from NP",
      message: "NP has requested collaboration",
      link: `/collaborators/${id}`,
    });

    // Send email to NP
    await sendEmail({
      to: physicianUser.email,
      subject: "Collaboration Request from NP",
      body: "NP has requested collaboration",
    });

    return NextResponse.json({
      success: true,
      data: savedCollaborationRequest,
      message: "Collaboration request received successfully",
    });
  } catch (error) {
    console.error("Error requesting collaboration:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
