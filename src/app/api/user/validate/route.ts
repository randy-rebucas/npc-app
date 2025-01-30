import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const email = searchParams.get("email");

    await connect();

    // Check if username/email exists for any user except the current user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      email: { $ne: session.user?.email } // Exclude current user
    });

    return NextResponse.json({
      isAvailable: !existingUser,
      message: existingUser ? "Username or email already taken" : "Available"
    });
  } catch (error) {
    console.error("Error in user validation:", error);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
