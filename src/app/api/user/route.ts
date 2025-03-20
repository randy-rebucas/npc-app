import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connect from "@/lib/db";
import Template from "@/app/models/Template";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";


export async function GET() {
  try {
    await connect();

    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById(claims?.id);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

export async function PUT(request: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById(claims?.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await connect();

    const data = await request.json();
    user.username = data.username;
    user.email = data.email;
    await user.save();

    // Get the default template for profile updated
    let template = await Template.findOne({ isDefault: true, type: "email", code: "profile-updated" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "profile-updated" });
    }

    // const emailService = new EmailService();
    // await emailService.sendEmail({
    //   to: { email: user.email! },
    //   subject: template?.name || "Profile Updated",
    //   htmlContent: template?.content || "<p>Your profile has been updated</p>",
    //   sender: {
    //     name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
    //     email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
    //   },
    //   replyTo: {
    //     name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
    //     email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
    //   },
    // });

    return NextResponse.json(user); 
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
