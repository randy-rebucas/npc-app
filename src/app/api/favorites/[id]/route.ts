import { NextRequest, NextResponse } from "next/server";
import Favorite from "@/app/models/Favorite";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await Favorite.deleteOne({ _id: id });
  return NextResponse.json({
    success: true,
    message: "Favorite removed successfully",
  });
}
