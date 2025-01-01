import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connect from "@/lib/db";
import Notification from "@/app/models/Notification";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Failed to update notification:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
