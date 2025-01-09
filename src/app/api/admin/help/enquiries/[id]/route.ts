import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Enquiry from "@/app/models/Enquiry";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const enquiry = await Enquiry.findById(id);
    return NextResponse.json(enquiry);
  } catch (error) {
    console.error("Error in enquiry:", error);
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
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
    const enquiry = await Enquiry.findByIdAndUpdate(id, data, {
      new: true,
    });
    
    return NextResponse.json(enquiry);
  } catch (error) {
    console.error("Error in enquiry:", error);
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connect();
  await Enquiry.findByIdAndDelete(id);
  return NextResponse.json({ message: "Enquiry deleted" });
}
