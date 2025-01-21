import {
    CollaborationRequest,
    ActiveCollaboration,
    ActiveCollaborationStatus,
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

      // Check if the collaboration request exists
      const collaborationRequest = await CollaborationRequest.findById(id);
      if (!collaborationRequest) {
        return NextResponse.json(
          { error: "Collaboration request not found" },
          { status: 404 }
        );
      }

      // Withdraw the offer
      const offer = await Offer.findOneAndUpdate({ collaborationId: id }, { status: OfferStatus.ACCEPTED }); 
      if (!offer) {
        return NextResponse.json(
          { error: "Offer not found" },
          { status: 404 }
        );
      }
      
      // Create an active collaboration
      const activeCollaboration = await ActiveCollaboration.create({ 
        npUser: collaborationRequest.npUser,
        physicianUser: collaborationRequest.physicianUser,
        startDate: new Date(),
        status: ActiveCollaborationStatus.ACTIVE,
        agreementSignedAt: new Date(),
        lastAttestationDate: new Date(),
        nextAttestationDue: new Date(),
      });

      // Delete the collaboration request
      await collaborationRequest.deleteOne();
  
      if (activeCollaboration) {
        const npUser = await User.findById(activeCollaboration.npUser); 
        // Create a notification for the NP
        await Notification.create({
          user: npUser.id,
          title: "Offer Accepted",
          message: "Your offer has been accepted",
          link: `/collaborators/${id}`
        });

        // TODO: Send email to NP
        await sendEmail({
          to: npUser.email,
          subject: "Offer Accepted",
          body: "Your offer has been accepted"
        });
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error accepting offer:", error);
      return NextResponse.json(
        { error: "Failed to accept offer" },
        { status: 500 }
      );
    }
  }
  