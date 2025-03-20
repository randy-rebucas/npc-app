import { NextResponse } from "next/server";
import Chat from "@/app/models/Chat";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function POST(req: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { message } = await req.json();

    // Save the chat message to the database
    const chatMessage = await Chat.create({
      content: message,
      customerId: claims?.id,
      
    });


    // Here you can implement your chatbot logic
    // For now, we'll return a simple response
    const botResponse = "Thank you for your message! Our team will get back to you soon.";

    return NextResponse.json({
      success: true,
      response: botResponse,
      messageId: chatMessage.id,
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
