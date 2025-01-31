import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import NotificationSetting from "@/app/models/NotificationSetting";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connect from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, value } = await request.json();

    await connect();

    const settings = await NotificationSetting.updateOne(
      { user: session.user.id },
      {
        $set: {
          [`notificationTypes.${type}`]: value,
        },
      }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update notification type" },
      { status: 500 }
    );
  }
}
