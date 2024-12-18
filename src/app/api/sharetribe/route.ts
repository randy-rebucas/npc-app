import connect from "@/lib/db";
import Member from "@/app/models/Member";
import { generatePassword } from "@/lib/utils";
import sharetribeSDK from "sharetribe-flex-sdk";

export async function POST(request: Request) {
  console.log("Syncing member to Sharetribe");
  connect();
  const { id } = await request.json();

  const member = await Member.findById(id).exec();

  if (!member) {
    return;
  }
  console.log(member);

  const sdk = sharetribeSDK.createInstance({
    clientId: process.env.SHARETRIBE_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_CLIENT_SECRET,
    baseUrl: process.env.SHARETRIBE_MARKETPLACE_URL,
  });

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
  }

  console.log("Synced member to Sharetribe");
  return Response.json(sharetribeUser);
}
