import Chat from "@/app/models/Chat";
import { NextResponse } from "next/server";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function POST(request: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
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
            sender: claims?.id,
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