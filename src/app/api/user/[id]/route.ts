import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const user = await User.findById(id);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
) {
  const session = await getServerSession(authOptions);
  const data = await request.json();

  try {
    await connect();
    User.findByIdAndUpdate(session?.user.id, data);
    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
