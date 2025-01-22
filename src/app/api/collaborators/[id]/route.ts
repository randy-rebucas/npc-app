import { NextResponse } from "next/server";
import { CollaborationRequest } from "@/app/models/Collaboration";
import connect from "@/lib/db";
import User from "@/app/models/User";
import Notification from "@/app/models/Notification";
import { sendEmail } from "@/lib/email";

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

    // Create a notification for the NP
    const npUser = await User.findById(collaborator.npUser);
    
    if (!npUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await Notification.create({
      user: npUser.id,
      title: "Collaboration Request Removed",
      message: "Your collaboration request has been removed",
      link: `/collaborators/request`,
    });

    // Send email to NP
    await sendEmail({
      to: npUser.email,
      subject: "Collaboration Request Removed",
      body: "Your collaboration request has been removed",
    });

    return NextResponse.json({ 
      success: true,
      message: "Collaborator removed successfully" 
    });
    
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
};
