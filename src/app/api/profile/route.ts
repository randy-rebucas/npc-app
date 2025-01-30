import { NextResponse } from "next/server";
import connect from "@/lib/db";
import UserProfile from "@/app/models/UserProfile";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import User from "@/app/models/User";
import { createEvent } from "@/app/actions/events";
import { EventType } from "@/app/models/Event";

export async function POST(request: Request) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ email: session?.user?.email });

    const data = await request.json();

    const userProfile = await UserProfile.findOneAndUpdate(
      { user: user._id },
      {
        ...data,
      },
      { new: true }
    );

    await createEvent({
      user: user._id,
      email: user.email!,
      type: EventType.MEMBER_UPDATED,
    });
    return NextResponse.json({ userProfile });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await UserProfile.findOne({ user: session?.user?.id }).populate('user');
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { username, email, bio } = await request.json();

    const user = await User.findOne({ email: session?.user?.email });
    user.username = username;
    user.email = email;
    await user.save();


    const userProfile = await UserProfile.findOneAndUpdate(
      { user: user._id },
      {
        description: bio,
      },
      { new: true }
    );
    return NextResponse.json({ userProfile });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
