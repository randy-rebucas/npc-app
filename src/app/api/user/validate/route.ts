import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connect from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const email = searchParams.get("email");

  try {
    await connect();
    const user = await User.findOne({ $or: [{ username }, { email }] });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
