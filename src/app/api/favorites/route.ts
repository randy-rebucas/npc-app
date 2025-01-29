import { NextRequest, NextResponse } from "next/server";
import Favorite from "@/app/models/Favorite";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connect from "@/lib/db";

// Add this export to mark the route as dynamic
export const dynamic = 'force-dynamic';

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

    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({
      npUser: session?.user?.id,
      physicianUser: id,
    });

    if (existingFavorite) {
      // if (isFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });

      return NextResponse.json({
        success: true,
        message: "Favorite removed successfully",
      });
      // }
    } else {
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
        message: "Favorite added successfully",
      });
    }
  } catch (error) {
    console.error("Error in favorite:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add favorite" },
      { status: 500 }
    );
  }
}
