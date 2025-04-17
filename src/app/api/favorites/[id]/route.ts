import { NextRequest, NextResponse } from "next/server";
import Favorite from "@/app/models/Favorite";
import mongoose from "mongoose";
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await Favorite.deleteOne({ _id: new mongoose.Types.ObjectId(id as string) });
  return NextResponse.json({
    success: true,
    message: "Favorite removed successfully",
  });
}
