import { sdk } from "@/config/sharetribe";
import connect from "@/lib/db";
import { generatePassword } from "@/lib/utils";
import { createEvent } from "@/app/actions/events";
import User from "@/app/models/User";
import { EventType } from "@/app/models/Event";
import { getUserById } from "@/app/actions/user";

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

    return Response.json({ success: true, user: sharetribeUser });

  } catch (error) {
    console.error("Error syncing user to Sharetribe:", error); 
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
