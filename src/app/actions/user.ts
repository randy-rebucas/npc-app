"use server";

import User from "@/app/models/User";
import connect from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    await connect();
    const user = await User.aggregate([
      {
        $match: {
          email: email,
        },
      },
      {
        $lookup: {
          from: "userprofiles",
          localField: "_id",
          foreignField: "user",
          as: "profile",
        },
      },
      {
        $addFields: {
          profile: {
            $first: "$profile",
          },
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (!user) {
      return null;
    }

    return user[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

export async function getUserById(id: string) {
  await connect();
  const user = await User.findById(id);
  return user;
}

export async function getOnboardingStatus(id: string) {
  console.log(id);
  await connect();
  const user = await User.findById(id);
  return user?.onboardingStatus;
}