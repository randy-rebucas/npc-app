import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Notification from "@/app/models/Notification";
import connect from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const notifications = await Notification.find({ 
      user: session.user.id 
    }).sort({ createdAt: -1 });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 