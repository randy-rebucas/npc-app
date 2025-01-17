import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connect from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connect();

    const users = await User.find(
      { _id: { $ne: session.user.id } },
      'name role'
    );
    console.log('Users:', users);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}