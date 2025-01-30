import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";

export async function PUT(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();
    console.log(currentPassword, newPassword);
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
    }
    user.password = newPassword;
    await user.save();
    
    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update password" },
      { status: 500 }
    );
  }
}
