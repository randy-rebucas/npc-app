import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connect from "@/lib/db";
import Chat from "@/app/models/Chat";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const chat = await Chat.findOne({
      customerId: session.user.id,
      agentId: session.user.id,
    })
      .select("messages")
      .populate("messages.sender", "name email")
      .lean();

    console.log(chat);
    return NextResponse.json({ messages: chat });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
