import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connect from "@/lib/db";
import Message, { IMessage } from "@/app/models/Messsage";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const userId = session?.user?.id;

    const chatMessages = await Message.find({ user: userId })
      .sort({ createdAt: 1 })
      .limit(50);

    return NextResponse.json({
      messages: chatMessages.map((msg: IMessage) => ({
        id: msg._id.toString(),
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.createdAt,
      })),
    });
  } catch (error) {
    console.error("Chat History Error:", error);
    return NextResponse.json(
      { error: "Failed to load message history" },
      { status: 500 }
    );
  }
}
