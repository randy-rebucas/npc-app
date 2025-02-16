import { NextResponse } from "next/server";
import connect from "@/lib/db";
import UserProfile from "@/app/models/UserProfile";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import User from "@/app/models/User";
import { createEvent } from "@/app/actions/events";
import { EventType } from "@/app/models/Event";
import { EmailService } from "@/lib/email";
import Template from "@/app/models/Template";

export async function POST(request: Request) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ email: session?.user?.email });

    const data = await request.json();

    const userProfile = await UserProfile.findOneAndUpdate(
      { user: user._id },
      {
        ...data,
      },
      { new: true }
    );

    await createEvent({
      user: user._id,
      email: user.email!,
      type: EventType.MEMBER_UPDATED,
    });

    // Get the default template for profile updated
    let template = await Template.findOne({ isDefault: true, type: "email", code: "profile-updated" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "profile-updated" });
    }

    const emailService = new EmailService();
    await emailService.sendEmail({
      to: { email: user.email! },
      subject: template?.name || "Profile Updated",
      htmlContent: template?.content || "<p>Your profile has been updated</p>",
      sender: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
        email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
      },
      replyTo: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
        email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
      },
    });

    return NextResponse.json({ userProfile });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await UserProfile.findOne({
      user: session?.user?.id,
    }).populate("user");
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {
      description,
      firstName,
      lastName,
      practiceType,
      primaryStateOfPractice,
      professionalDesignation,
      startDate,
      npi,
      controlledSubstances,
    } = await request.json();
    // Semple description Lance Aaron Tenorio [ 'Primary Care' ] New York Nurse Practitioner 2025-01-28T03:09:53.733Z 2321312313 yes

    const userProfile = await UserProfile.findOneAndUpdate(
      { user: session?.user?.id },
      {
        description: description,
        firstName: firstName,
        lastName: lastName,
        practiceTypes: practiceType,
        medicalLicenseStates: [{ state: primaryStateOfPractice }],
        title: professionalDesignation,
        npiNumber: npi,
        startDate: startDate,
        controlledSubstances: controlledSubstances,
      },
      { new: true }
    );
    return NextResponse.json({ userProfile });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
