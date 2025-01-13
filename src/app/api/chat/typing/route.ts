import { NextResponse } from "next/server";
import  Chat  from "@/app/models/Chat";
import connect from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Connect to database
    await connect();

    // Get chatId and typing status from request
    const { chatId, isCustomerTyping } = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    // Update the chat with new typing status
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { isCustomerTyping },
      { new: true }
    );

    if (!updatedChat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error("Error updating typing status:", error);
    return NextResponse.json(
      { error: "Failed to update typing status" },
      { status: 500 }
    );
  }
}