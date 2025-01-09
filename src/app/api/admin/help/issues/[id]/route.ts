import { NextResponse } from "next/server";
import connect from "@/lib/db";
import ReportedIssue from "@/app/models/ReportedIssue";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const issue = await ReportedIssue.findById(id);
    return NextResponse.json(issue);
  } catch (error) {
    console.error("Error in issue:", error);
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
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
    const issue = await ReportedIssue.findByIdAndUpdate(id, data, {
      new: true,
    });
    
    return NextResponse.json(issue);
  } catch (error) {
    console.error("Error in issue:", error);
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connect();
  await ReportedIssue.findByIdAndDelete(id);
  return NextResponse.json({ message: "Issue deleted" });
}
