import { authOptions } from "../auth/[...nextauth]/options";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connect from "@/lib/db";

export async function GET() {
  try {
    await connect();
 
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user.id);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  try {
    await connect();
    const data = await request.json();
    const userUpdated = await User.findByIdAndUpdate(session?.user.id, data);
    return NextResponse.json(userUpdated);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
