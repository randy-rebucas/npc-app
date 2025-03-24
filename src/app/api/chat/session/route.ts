import { NextResponse } from "next/server";
import Chat from "@/app/models/Chat";
import connect from "@/lib/db";
import mongoose from "mongoose";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function GET(request: Request) {
  const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
  }

  try {
    await connect();

    const chat = await Chat.findOne({
      _id: new mongoose.Types.ObjectId(chatId),
      $or: [{ customerId: claims?.id }, { agentId: claims?.id }],
    }).populate([
      {
        path: "customerId",
        select: "name image",
      },
      {
        path: "agentId",
        select: "name image",
      },
      {
        path: "messages.sender",
        select: "name image",
      },
    ]);

    if (!chat) {
      const newChat = await Chat.create({
        _id: new mongoose.Types.ObjectId(chatId),
        customerId: claims?.id,
        agentId: claims?.id,
      });
      return NextResponse.json({ chat: newChat });
    }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Error fetching chat session:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat session" },
      { status: 500 }
    );
  }
}
