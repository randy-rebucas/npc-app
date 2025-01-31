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
  try {
    const session = await getServerSession(authOptions);

    await connect();

    const data = await request.json();

    const user = await User.findOne({ email: session?.user?.email });
    user.username = data.username;
    user.email = data.email;
    await user.save();

    return NextResponse.json(user); 
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
