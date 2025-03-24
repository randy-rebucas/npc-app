import { NextResponse } from 'next/server';
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import connect from "@/lib/db";
import Message from '@/app/models/Message';

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const messages = await Message.find({ 
      $or: [
        { senderId: claims?.id },
        { receiverId: claims?.id }
      ]
    }).sort({ timestamp: -1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { receiverId, content } = await req.json();
    
    const message = await Message.create({
      senderId: claims?.id,
      receiverId,
      content,
      timestamp: new Date(),
      read: false
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error(error); 
    return new NextResponse('Internal Error', { status: 500 });
  }
} 