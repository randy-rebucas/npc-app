import {
    CollaborationRequest,
    CollaborationRequestStatus,
  } from "@/app/models/Collaboration";
import Offer from "@/app/models/Offer";
import { OfferStatus } from "@/app/models/Offer";
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
          { error: "Collaboration request not found" },
          { status: 404 }
        );
      }

      // Withdraw the offer
      const offer = await Offer.findOneAndUpdate({ collaborationId: id }, { status: OfferStatus.WITHDRAWN });
      if (!offer) {
        return NextResponse.json(
          { error: "Offer not found" },
          { status: 404 }
        );
      }
  
      collaborationRequest.status = CollaborationRequestStatus.WITHDRAWN;
      collaborationRequest.responseMessage = "Offer withdrawn";
      collaborationRequest.respondedAt = new Date();
      const savedCollaborationRequest = await collaborationRequest.save();
  
      if (savedCollaborationRequest) {
        const npUser = await User.findById(savedCollaborationRequest.npUser); 
        // Create a notification for the NP
        await Notification.create({
          user: npUser.id,
          title: "Offer Withdrawn",
          message: "Your offer has been withdrawn",
          link: `/collaborators/${id}`
        });

        // Send email to NP
        await sendEmail({
          to: npUser.email,
          subject: "Offer Withdrawn",
          body: "Your offer has been withdrawn"
        });

        return NextResponse.json({
          success: true,
          data: {
            collaborationRequest: savedCollaborationRequest,
            offer: offer,
            message: "Offer successfully withdrawn"
          }
        });
      }

      return NextResponse.json(
        { error: "Failed to save collaboration request" },
        { status: 500 }
      );
    } catch (error) {
      console.error("Error withdrawing offer:", error);
      return NextResponse.json(
        { error: "Failed to withdraw offer" },
        { status: 500 }
      );
    }
  }
  