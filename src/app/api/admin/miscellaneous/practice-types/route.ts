import { NextResponse } from "next/server";
import connect from "@/lib/db";
import PracticeType from "@/app/models/PracticeType";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    await connect();
    const practiceType = await PracticeType.create(data);
    return NextResponse.json(practiceType);
  } catch (error) {
    console.error("Error in practice type:", error);
    return NextResponse.json(
      { error: "Practice type not found" },
      { status: 404 }
    );
  }
}
