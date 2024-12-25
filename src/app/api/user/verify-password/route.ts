import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connect from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    await connect();
    const { password } = await request.json();
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user.id);
    const isMatch = await user.comparePassword(password);
    return NextResponse.json({ isMatch });
  } catch (error) {
    console.error("Error in verify-password:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
