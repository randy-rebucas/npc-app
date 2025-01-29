import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connect from "@/lib/db";
import Message from '@/app/models/Message';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connect();
    // Get all messages for the user
    const messages = await Message.find({
      $or: [
        { senderId: session.user.id },
        { receiverId: session.user.id }
      ]
    });

    // Get unique user IDs from messages
    const userIds = [...new Set([
      ...messages.map(msg => msg.senderId.toString()),
      ...messages.map(msg => msg.receiverId.toString())
    ])].filter(id => id !== session.user.id);

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