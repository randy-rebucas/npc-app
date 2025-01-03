import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connect from "@/lib/db";
import Message from "@/app/models/Message";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 });
    }

    await connect();

    const messages = await Message.find({ chatId })
      .sort({ timestamp: 1 })
      .lean();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
