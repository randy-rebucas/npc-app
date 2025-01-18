import { NextResponse } from "next/server";
import Message from "@/app/models/Message";
import mongoose from "mongoose";
import connect from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

// GET - Fetch messages
export async function GET() {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const senderId = session.user.id;
    const receiverId = "666666666666666666666666";
    
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: "asc" });
    
    return messages.length > 0
      ? NextResponse.json(messages)
      : NextResponse.json({ error: "No messages found" }, { status: 404 });
  } catch (error) {
    console.error("Error in messages GET:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create a new message
export async function POST(request: Request) {
  try {
    console.log("POST request received");
    await connect();
    const { content, senderId, receiverId } = await request.json();
    console.log(content, senderId, receiverId);
    if (!content || !senderId || !receiverId) {
      return NextResponse.json(
        { error: "content, senderId, and receiverId are required" },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return NextResponse.json(
        { error: "Invalid senderId or receiverId" },
        { status: 400 }
      );
    }

    const message = await Message.create({
      content,
      senderId,
      receiverId,
      timestamp: new Date(),
      read: false,
    });
    console.log(message);
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error in messages POST:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH - Mark messages as read
export async function PATCH(request: Request) {
  try {
    await connect();
    const { receiverId, senderId } = await request.json();

    if (!receiverId || !senderId) {
      return NextResponse.json(
        { error: "receiverId and senderId are required" },
        { status: 400 }
      );
    }

    // Mark all unread messages from sender to receiver as read
    const result = await Message.updateMany(
      {
        senderId,
        receiverId,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    return NextResponse.json({
      message: "Messages marked as read",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error in messages PATCH:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a message
export async function DELETE(request: Request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("id");

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json(
        { error: "Invalid message ID" },
        { status: 400 }
      );
    }

    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in messages DELETE:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
