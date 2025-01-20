import {
    CollaborationRequest,
    CollaborationRequestStatus,
  } from "@/app/models/Collaboration";

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
  
      collaborationRequest.status = CollaborationRequestStatus.WITHDRAWN;
      collaborationRequest.responseMessage = "Offer withdrawn";
      collaborationRequest.respondedAt = new Date();
      const savedCollaborationRequest = await collaborationRequest.save();
  
      if (savedCollaborationRequest) {
        // TODO: Send email to NP
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error withdrawing offer:", error);
      return NextResponse.json(
        { error: "Failed to withdraw offer" },
        { status: 500 }
      );
    }
  }
  