import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connect from "@/lib/db";
import Chat from "@/app/models/Chat";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const chat = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatId),
      $or: [{ customerId: session.user.id }, { agentId: session.user.id }],
    })
      .select("messages")
      .populate("messages.sender", "name email")
      .lean();

    console.log(chat);
    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
