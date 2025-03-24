import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Chat from "@/app/models/Chat";
import User from "@/app/models/User";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function GET(request: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    await connect();

    const chatParticipants = await Chat.findById(chatId)
      .populate("customerId", "name email image")
      .populate("agentId", "name email image")
      .lean();

    if (!chatParticipants) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ members: chatParticipants });
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, email } = await request.json();

    if (!chatId || !email) {
      return NextResponse.json(
        { error: "Chat ID and email are required" },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.participants.includes(user._id)) {
      return NextResponse.json(
        { error: "User already in chat" },
        { status: 400 }
      );
    }

    chat.participants.push(user._id);
    await chat.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to add member:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
