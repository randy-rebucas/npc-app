import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import connect from "@/lib/db";
import Chat from "@/app/models/Chat";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const chats = await Chat.find({
      participants: { $in: [session.user.id] }
    })
      .sort({ timestamp: -1 })
      .lean();

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
