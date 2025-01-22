import { NextResponse } from "next/server";
import {
  CollaborationRequest,
  CollaborationRequestStatus,
} from "@/app/models/Collaboration";
import connect from "@/lib/db";
import User from "@/app/models/User";
import Notification from "@/app/models/Notification";
import { sendEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connect();
    const collaborationRequest = await CollaborationRequest.findById(id);
    if (!collaborationRequest) {
      return NextResponse.json(
        { success: false, error: "Collaboration request not found" },
        { status: 404 }
      );
    }

    collaborationRequest.status = CollaborationRequestStatus.DECLINED;
    collaborationRequest.responseMessage = "Collaboration request declined";
    collaborationRequest.respondedAt = new Date();
    const savedCollaborationRequest = await collaborationRequest.save();

    if (!savedCollaborationRequest) {
      return NextResponse.json(
        { success: false, error: "Failed to save collaboration request" },
        { status: 500 }
      );
    }

    const npUser = await User.findById(savedCollaborationRequest.npUser);
    if (!npUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create a notification for the NP
    await Notification.create({
      user: npUser.id,
      title: "Collaboration Request Declined",
      message: "Your collaboration request has been declined",
      link: `/collaborators/${id}`,
    });

    // Send email to NP
    await sendEmail({
      to: npUser.email,
      subject: "Collaboration Request Declined",
      body: "Your collaboration request has been declined",
    });

    return NextResponse.json({ 
      success: true, 
      message: "Collaboration request declined successfully" 
    });

  } catch (error) {
    console.error("Error declining collaboration request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
