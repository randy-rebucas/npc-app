"use server";

import mongoose from "mongoose";
// import { sdk } from "@/lib/sharetribe";
import Member from "../models/Member";
import connect from "@/lib/db";

export async function syncMembers(id: string) {
  try {
    connect();

    const member = await Member.findById(new mongoose.Types.ObjectId(id)).exec();

    if (!member) {
      return;
    }
    console.log(member);
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
