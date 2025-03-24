import { NextResponse } from 'next/server';
import connect from "@/lib/db";
import Message from '@/app/models/Message';
import Chat from '@/app/models/Chat';
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/app/logto';

export async function POST(request: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
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
      sender: claims?.id,
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