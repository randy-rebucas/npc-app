import { sdk } from "@/config/sharetribe";
import connect from "@/lib/db";
import Member from "@/app/models/Member";
import { generatePassword } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    console.log("Syncing member to Sharetribe");
    await connect();
    const { id } = await request.json();

    const member = await Member.findById(id).exec();

    if (!member) {
      return Response.json({ error: "Member not found" }, { status: 404 });
    }

    console.log(member);

    const customFields = {
      firstName: member.payload.customFields["first-name"] || "User",
      lastName: member.payload.customFields["last-name"] || "Name",
      displayName: member.payload.customFields["display-name"],
    };

    /**
     * Create the payload for the user
     */
    const sharetribePayload = {
      email: member.payload.auth.email,
      password: generatePassword(),
      firstName: customFields.firstName,
      lastName: customFields.lastName,
      displayName:
        customFields.displayName ||
        `${customFields.firstName} ${customFields.lastName}`,
      protectedData: {},
      publicData: {},
    };
    /**
     * Sync the user to Sharetribe
     */
    const sharetribeUser = await sdk.currentUser.create(sharetribePayload);

    /**
     * Update the member accountSynced to true
     */
    if (sharetribeUser) {
      await Member.findByIdAndUpdate(id, {
        $set: {
          accountSynced: true,
        },
      });
      console.log("Synced member to Sharetribe");
      return Response.json(sharetribeUser);
    }

    return Response.json(
      { error: "Failed to create Sharetribe user" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error syncing member to Sharetribe:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
