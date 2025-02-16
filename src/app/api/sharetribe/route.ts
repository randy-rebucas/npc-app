import { sdk } from "@/config/sharetribe";
import connect from "@/lib/db";
import { generatePassword } from "@/lib/utils";
import { createEvent } from "@/app/actions/events";
import User from "@/app/models/User";
import { EventType } from "@/app/models/Event";
import { getUserById } from "@/app/actions/user";
import { EmailService } from "@/lib/email";
import Template from "@/app/models/Template";

export async function POST(request: Request) {
  try {
    await connect();
    const { id } = await request.json();

    const user = await getUserById(id);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    /**
     * Create the payload for the user
     */
    const sharetribePayload = {
      email: user.email,
      password: generatePassword(),
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      displayName: `${user.profile.firstName} ${user.profile.lastName}` || user.username,
      protectedData: {},
      publicData: {},
    };
    /**
     * Sync the user to Sharetribe
     */
    const sharetribeUser = await sdk.currentUser.create(sharetribePayload);

    if (!sharetribeUser) {
      return Response.json(
        { error: "Failed to create Sharetribe user" },
        { status: 500 }
      );
    }

    /**
     * Update the member accountSynced to true
     */
    await User.findByIdAndUpdate(id, {
      $set: {
        metaData: {
          accountSynced: true,
        },
      },
    });

    // Create an event
    await createEvent({
      user: user._id,
      email: user.email,
      type: EventType.USER_SYNCED,
    });

    // Get the default template for account synced
    let template = await Template.findOne({ isDefault: true, type: "email", code: "account-synced" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "account-synced" });
    }

    const emailService = new EmailService();
    await emailService.sendEmail({
      to: { email: user.email! },
      subject: template?.name || "Account Synced",
      htmlContent: template?.content || "<p>Your account has been synced to Sharetribe</p>",
      sender: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
        email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
      },
      replyTo: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
        email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
      },
    });

    return Response.json({ success: true, user: sharetribeUser });

  } catch (error) {
    console.error("Error syncing user to Sharetribe:", error); 
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
