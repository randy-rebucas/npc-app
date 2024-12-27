import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import UserProfile from "@/app/models/UserProfile";
import bcrypt from "bcrypt";
import { createEvent } from "@/app/actions/events";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  await connect();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "CUSTOMER",
      provider: "credentials",
    });

    await UserProfile.create({
      user: user._id,
    });

    await createEvent({
      user: user._id,
      email: user.email!,
      type: 'member-created'
    });

    return NextResponse.json({ message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating account" },
      { status: 500 }
    );
  }
}
