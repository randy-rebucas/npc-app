import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connect from "@/lib/db";
import Message from '@/app/models/Message';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const messages = await Message.find({ 
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { receiverId, content } = await req.json();
    
    const message = await Message.create({
      senderId: session.user.id,
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