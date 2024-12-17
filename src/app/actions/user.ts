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

    const { _id, ...rest } = user[0];
    return { id: _id.toString(), ...rest };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}
