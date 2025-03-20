import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connect from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }
    
    await connect();
    const user = await User.findById(new mongoose.Types.ObjectId(id));
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
) {

  const data = await request.json();

  try {
    await connect();
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ email: claims?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await User.findByIdAndUpdate(user._id, data);
    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
