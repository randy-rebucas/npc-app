import {
  CollaborationRequest,
  CollaborationRequestStatus,
} from "@/app/models/Collaboration";
import Offer, { OfferStatus } from "@/app/models/Offer";
import User from "@/app/models/User";
import Notification from "@/app/models/Notification";
import { sendEmail } from "@/lib/email";

import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collaborationRequest = await CollaborationRequest.findById(id);
    if (!collaborationRequest) {
      return NextResponse.json(
        { success: false, error: "Collaboration request not found" },
        { status: 404 }
      );
    }

    const offer = await Offer.findOneAndUpdate(
      { collaborationId: id },
      { status: OfferStatus.CANCELLED }
    );
    if (!offer) {
      return NextResponse.json(
        { success: false, error: "Offer not found" },
        { status: 404 }
      );
    }

    // Cancel the offer
    collaborationRequest.status = CollaborationRequestStatus.CANCELLED;
    collaborationRequest.responseMessage = "Offer cancelled";
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
      title: "Offer Cancelled",
      message: "Your offer has been cancelled",
      link: `/collaborators/${id}`,
    });

    // Send email to NP
    await sendEmail({
      to: npUser.email,
      subject: "Offer Cancelled",
      body: "Your offer has been cancelled",
    });

    return NextResponse.json({
      success: true,
      message: "Offer cancelled successfully",
      data: savedCollaborationRequest,
    });
  } catch (error) {
    console.error("Error cancelling offer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel offer" },
      { status: 500 }
    );
  }
}
