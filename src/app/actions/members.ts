"use server";
import { unstable_noStore as noStore } from "next/cache";
// import { sdk } from "@/lib/sharetribe";
import Member from "../models/Member";
import connect from "@/lib/db";

export async function syncMembers(id: string) {
  try {
    connect();
    noStore();
    console.log(id);
    const member = await Member.findById(id).exec();

    console.log(member);
    if (!member) {
      return;
    }
    return member;
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
