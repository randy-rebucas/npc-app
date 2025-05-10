import { NextResponse } from "next/server";
import { getUser, updateUserCustomData } from "@/app/actions/user";
import { IUserCustomData } from "@/app/models/User";

export async function POST(req: Request) {
  try {
    const { access_token, user_id } = await req.json();

    const userData = await getUser(user_id);
    if (userData.customData?.googleCalendarAccessToken) {
      return NextResponse.json(
        { error: "Access token already exists" },
        { status: 400 }
      );
    }
    await updateUserCustomData(user_id, {
      ...userData.customData,
      googleCalendarAccessToken: access_token,
    } as IUserCustomData);

    return NextResponse.json(
      { message: "Access token updated successfully" },
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
