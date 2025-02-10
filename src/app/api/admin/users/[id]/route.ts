import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connect();
    const data = await request.json();
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }
}
