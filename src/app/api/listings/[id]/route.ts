import { NextRequest, NextResponse } from "next/server";
import Listing from "@/app/models/Listing";
import connect from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    await connect();
    const listing = await Listing.findById(id);
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error in listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
