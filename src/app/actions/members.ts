"use server";

// import { sdk } from "@/lib/sharetribe";
import Member from "../models/Member";

export async function syncMembers(id: string) {
  try {
    console.log("Syncing member:", id);

    const member = await Member.findById(id).exec();

    if (!member) {
      return;
    }

    console.log("Member found:", member);
    return;
    // // Example user data - adjust according to your needs
    // const userData = {
    //   email: "user@example.com",
    //   firstName: "John",
    //   lastName: "Doe",
    //   password: "securePassword123",
    // };

    // const response = await sdk.users.create({
    //   body: userData,
    // });

    // console.log("User created:", response);
    // return response;
  } catch (error) {
    console.error("Error syncing members:", error);
    throw error;
  }
}
