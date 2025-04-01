import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
// import { EmailService } from "@/lib/email";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connect();
    const data = await request.json();
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // // Send email to user
    // const email = new EmailService();
    // email.sendEmail({
    //   to: user.email,
    //   subject: "Submission Status",
    //   htmlContent: `<p>Your submission status has been updated to ${user.submissionStatus}</p>`,
    //   textContent: `Your submission status has been updated to ${user.submissionStatus}`,
    //   sender: {
    //     name: "npcollaborator",
    //     email: "noreply@npcollaborator.com",
    //   },
    //   replyTo: {
    //     name: "npcollaborator",
    //     email: "noreply@npcollaborator.com",
    //   },
    // });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in user:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
