import UserProfile from "@/app/models/UserProfile";
import connect from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    await connect();

    const { profilePhotoPath } = await request.json();

    const userProfile = await UserProfile.findOne({ user: session?.user?.id });
    userProfile.profilePhotoPath = profilePhotoPath;
    await userProfile.save();

    return NextResponse.json(
      { message: "Avatar uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
