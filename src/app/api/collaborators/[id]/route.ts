import { NextResponse } from "next/server";
import { CollaborationRequest } from "@/app/models/Collaboration";
import connect from "@/lib/db";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await connect();
    const collaborator = await CollaborationRequest.findByIdAndDelete(id);
    if (!collaborator) {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 }
      );
    }

    if (collaborator) {
      // TODO: Send notification to the collaborator
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
};
