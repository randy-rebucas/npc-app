import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Chat from "@/app/models/Chat";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const chats = await Chat.find({
      $or: [{ customerId: claims?.id }, { agentId: claims?.id }]
    })
      .populate('customerId', 'username')
      .populate('agentId', 'username')
      .sort({ lastActivity: -1 })
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
