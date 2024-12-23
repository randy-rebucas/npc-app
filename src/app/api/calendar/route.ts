import connect from "@/lib/db";
import CalendarAccessToken from "@/app/models/CalendatAccessToken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { access_token, user_id } = await req.json();
    await connect();

    const accessToken = await CalendarAccessToken.findOne({ user: user_id });
    if (accessToken) {
      return NextResponse.json(
        { error: "Access token already exists" },
        { status: 400 }
      );
    }
    const newAccessToken = await CalendarAccessToken.create({
      access_token,
      user: user_id,
    });
    return NextResponse.json(
      { access_token: newAccessToken.access_token },
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
