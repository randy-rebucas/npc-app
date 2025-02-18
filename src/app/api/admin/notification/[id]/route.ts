import { NextResponse } from "next/server";
import connect from "@/lib/db";
import EmailNotification from "@/app/models/EmailNotification";
import { EmailService } from "@/lib/email";
import NotificationSetting from "@/app/models/NotificationSetting";
import Notification from "@/app/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();
    const notification = await EmailNotification.findById(id);
    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error in email notification:", error);
    return NextResponse.json(
      { error: "Email notification not found" },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const data = await request.json();

    const notification = await EmailNotification.findByIdAndUpdate(
      id,
      { ...data },
      {
        new: true,
      }
    );

    if (data.autoSend) {
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
          ...data,
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
                process.env.NEXT_PUBLIC_APP_EMAIL ||
                "noreply@npcollaborator.com",
            },
            replyTo: {
              name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
              email:
                process.env.NEXT_PUBLIC_APP_EMAIL ||
                "noreply@npcollaborator.com",
            },
          });
        }
      }
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error in template:", error);
    return NextResponse.json(
      { error: "Email notification not found" },
      { status: 404 }
    );
  }
}
