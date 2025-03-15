import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Notification from "@/app/models/Notification";
import connect from "@/lib/db";
import NotificationSetting from "@/app/models/NotificationSetting";
import { EmailService } from "@/lib/email";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();
    console.log(session.user);
    const notifications = await Notification.find({
      user: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const body = await request.json();

    // Check if the user has email notifications enabled
    const targetUser = await NotificationSetting.find({
      user: { $ne: session.user.id },
    })
      .populate("user")
      .lean();

    if (!targetUser) {
      return NextResponse.json({
        success: false,
        message: "Target user not found",
      });
    }

    const emailService = new EmailService();

    for (const target of targetUser) {

      // Create in-app notification
      const notification = await Notification.create({
        ...body,
        user: target.user._id,
        type: "in-app",
      });

      // Check if the user has email notifications enabled
      if (target.emailNotifications) {
        await emailService.sendEmail({
          to: { email: target.user.email! },
          subject: notification.title,
          htmlContent: notification.message,
          sender: {
            name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
            email:
              process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
          },
          replyTo: {
            name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
            email:
              process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
          },
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
    });
  } catch (error) {
    console.error("Error in notifications:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
