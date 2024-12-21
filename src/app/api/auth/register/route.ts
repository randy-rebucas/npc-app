import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import UserProfile from "@/app/models/UserProfile";
import { signIn } from "next-auth/react";

export async function POST(req: Request) {
  const { username, email, password, confirmPassword } = await req.json();
  console.log(username, email, password, confirmPassword);
  await connect();
  try {
    // TODO: Add your sign-up logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    const user = await User.create({
      username,
      email,
      password,
    });

    await UserProfile.create({
      user: user._id,
    });

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/onboarding",
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
