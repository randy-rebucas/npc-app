import { NextResponse } from "next/server";
import { MemberstackAdminService } from "@/utils/memberstack-admin";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const member = await MemberstackAdminService.getMemberById(params.id);
    return NextResponse.json(member);
  } catch (error) {
    console.error("Error in member:", error);
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await MemberstackAdminService.deleteMember(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in member:", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
