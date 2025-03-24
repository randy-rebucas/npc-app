import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import connect from "@/lib/db";
import Message from '@/app/models/Message';
import { logtoConfig } from '@/app/logto';
import { getLogtoContext } from '@logto/next/server-actions';

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig); 
    if (!isAuthenticated) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connect();
    // Get all messages for the user
    const messages = await Message.find({
      $or: [
        { senderId: claims?.id },
        { receiverId: claims?.id }
      ]
    });

    // Get unique user IDs from messages
    const userIds = [...new Set([
      ...messages.map(msg => msg.senderId.toString()),
      ...messages.map(msg => msg.receiverId.toString())
    ])].filter(id => id !== claims?.id);

    // Find users who have message interactions
    const users = await User.find(
      { _id: { $in: userIds } },
      'username role'
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}