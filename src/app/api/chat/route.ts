import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Chat from "@/app/models/Chat";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { message } = await req.json();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Save the chat message to the database
    const chatMessage = await Chat.create({
      content: message,
      customerId: session.user.id,
      
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
