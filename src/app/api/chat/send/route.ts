import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import connect from "@/lib/db";
import Message from '@/app/models/Message';
import Chat from '@/app/models/Chat';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, chatId } = await request.json();

    if (!content || !chatId) {
      return NextResponse.json({ error: 'Content and chatId are required' }, { status: 400 });
    }

    await connect();

    // Create new message
    const message = await Message.create({
      chatId,
      content,
      sender: session.user.id,
    });

    // Update chat's last message and timestamp
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: content,
      timestamp: new Date(),
      unread: true
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 