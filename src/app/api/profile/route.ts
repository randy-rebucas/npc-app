import { NextResponse } from "next/server";
import connect from "@/lib/db";
import UserProfile from "@/app/models/UserProfile";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import User from "@/app/models/User";

export async function POST(request: Request) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ email: session?.user?.email });

    const data = await request.json();

    const userProfile = await UserProfile.findOneAndUpdate({ user: user._id }, {
        ...data,
    }, { new: true });

    return NextResponse.json({ userProfile });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
