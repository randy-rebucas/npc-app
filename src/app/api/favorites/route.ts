import { NextRequest, NextResponse } from "next/server";
import Favorite from "@/app/models/Favorite";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connect from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    const favorite = new Favorite({
      npUser: session?.user?.id,
      physicianUser: id,
    });
    const savedFavorite = await favorite.save();

    if (!savedFavorite) {
      return NextResponse.json(
        { success: false, message: "Failed to save favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Favorite submitted successfully",
    });
  } catch (error) {
    console.error("Error in favorite:", error);
    return NextResponse.json(
      { error: "Failed to submit favorite" },
      { status: 500 }
    );
  }
}
