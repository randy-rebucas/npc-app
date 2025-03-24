import { NextResponse } from "next/server";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";
import { NextRequest } from "next/server";
import Favorite from "@/app/models/Favorite";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ isFavorite: false }, { status: 401 });
    }

    const existingFavorite = await Favorite.findOne({
      npUser: claims?.id,
      physicianUser: id,
    });

    return NextResponse.json({
      success: true,
      isFavorite: existingFavorite ? true : false,
    });
  } catch (error) {
    console.error("Error in favorite check:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check favorite" },
      { status: 500 }
    );
  }
}
