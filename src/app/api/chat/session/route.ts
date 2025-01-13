import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import  Chat  from "@/app/models/Chat";
import connect from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connect();
    
    const chat = await Chat.findOne({
      customerId: session.user.id,
      agentId: session.user.id
    }).populate([
      {
        path: 'customerId',
        select: 'name image'
      },
      {
        path: 'agentId',
        select: 'name image'
      },
      {
        path: 'messages.sender',
        select: 'name image'
      }
    ]);
    console.log(chat);
    // if (!chat) {
    //   return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    // }

    return NextResponse.json({ chat });
  } catch (error) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat session' },
      { status: 500 }
    );
  }
}