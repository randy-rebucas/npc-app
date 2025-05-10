import { NextResponse } from "next/server";
import { getUser, updateUserCustomData } from "@/app/actions/user";
import { IUserCustomData } from "@/app/models/User";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const userData = await getUser(id);

    return NextResponse.json({
      access_token: userData.customData?.googleCalendarAccessToken,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const userData = await getUser(id);

    await updateUserCustomData(id, {
        ...userData.customData,
        googleCalendarAccessToken: undefined,
    } as IUserCustomData);
    
    return NextResponse.json(
      { message: "Calendar disconnected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
