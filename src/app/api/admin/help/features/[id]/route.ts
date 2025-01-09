import { NextResponse } from "next/server";
import connect from "@/lib/db";
import RequesedtFeature from "@/app/models/RequesedtFeature";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const feature = await RequesedtFeature.findById(id);
    return NextResponse.json(feature);
  } catch (error) {
    console.error("Error in feature:", error);
    return NextResponse.json({ error: "Feature not found" }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connect();
    const data = await request.json();
    const feature = await RequesedtFeature.findByIdAndUpdate(id, data, {
      new: true,
    });
    
    return NextResponse.json(feature);
  } catch (error) {
    console.error("Error in feature:", error);
    return NextResponse.json({ error: "Feature not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connect();
  await RequesedtFeature.findByIdAndDelete(id);
  return NextResponse.json({ message: "Feature deleted" });
}
