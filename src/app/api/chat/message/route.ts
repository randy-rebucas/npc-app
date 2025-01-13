import Chat from "@/app/models/Chat";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, content, isCustomerTyping } = await request.json();
    
    // Validate required fields
    if (!chatId || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400
      });
    }

    // Update the chat document
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: {
            sender: session.user.id, // You'll need to get this from the session/auth
            content,
            isAgent: false,
            timestamp: new Date()
          }
        },
        isCustomerTyping,
        lastActivity: new Date()
      },
      { new: true }
    );

    if (!updatedChat) {
      return new Response(JSON.stringify({ error: 'Chat not found' }), {
        status: 404
      });
    }

    return new Response(JSON.stringify(updatedChat), {
      status: 200
    });

  } catch (error) {
    console.error('Error in POST /api/chat/message:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500
    });
  }
}