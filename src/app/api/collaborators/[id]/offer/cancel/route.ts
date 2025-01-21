import {
  CollaborationRequest,
  CollaborationRequestStatus,
} from "@/app/models/Collaboration";
import Offer, { OfferStatus } from "@/app/models/Offer";

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
        { error: "Collaboration request not found" },
        { status: 404 }
      );
    }

    const offer = await Offer.findOneAndUpdate({ collaborationId: id }, { status: OfferStatus.CANCELLED });
    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }
    // Cancel the offer
    collaborationRequest.status = CollaborationRequestStatus.CANCELLED;
    collaborationRequest.responseMessage = "Offer cancelled";
    collaborationRequest.respondedAt = new Date();
    const savedCollaborationRequest = await collaborationRequest.save();

    if (savedCollaborationRequest) {
      // TODO: Send email to NP
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling offer:", error);
    return NextResponse.json(
      { error: "Failed to cancel offer" },
      { status: 500 }
    );
  }
}
