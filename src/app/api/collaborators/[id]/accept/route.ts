import { NextResponse } from "next/server";
import {
  CollaborationRequest,
  CollaborationRequestStatus,
} from "@/app/models/Collaboration";
import connect from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(id);
    await connect();
    const collaborationRequest = await CollaborationRequest.findById(id);
    if (!collaborationRequest) {
      return NextResponse.json(
        { error: "Collaboration request not found" },
        { status: 404 }
      );
    }
    collaborationRequest.status = CollaborationRequestStatus.ACCEPTED;
    collaborationRequest.responseMessage = "Offer accepted";
    collaborationRequest.respondedAt = new Date();
    const savedCollaborationRequest = await collaborationRequest.save();

    if (savedCollaborationRequest) {
      // TODO: Send email to NP
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error accepting offer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
