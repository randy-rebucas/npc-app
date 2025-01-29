import connect from "@/lib/db";
import Favorite from "../models/Favorite";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function getFavorites() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    await connect();

    const favorites = await Favorite.aggregate([
      {
        $match: {
          npUser: new mongoose.Types.ObjectId(String(session.user.id)),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "physicianUser",
          foreignField: "_id",
          as: "physicianUser",
          pipeline: [
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
                profile: { $arrayElemAt: ["$profile", 0] },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          physicianUser: { $arrayElemAt: ["$physicianUser", 0] },
        },
      },
    ]);

    const transformedFavorites = favorites.map((favorite) => ({
      id: favorite._id.toString(),
      npUser: favorite.npUser.toString(),
      physicianUser: {
        email: favorite.physicianUser.email,
        id: favorite.physicianUser._id.toString(),
        profile: {
          profilePhotoPath: favorite.physicianUser.profile.profilePhotoPath,
          firstName: favorite.physicianUser.profile.firstName,
          lastName: favorite.physicianUser.profile.lastName,
          title: favorite.physicianUser.profile.title,
          boardCertification: favorite.physicianUser.profile.boardCertification,
          practiceTypes: favorite.physicianUser.profile.practiceTypes,
          monthlyCollaborationRate:
            favorite.physicianUser.profile.monthlyCollaborationRate,
          additionalStateFee: favorite.physicianUser.profile.additionalStateFee,
          additionalNPFee: favorite.physicianUser.profile.additionalNPFee,
          controlledSubstancesMonthlyFee:
            favorite.physicianUser.profile.controlledSubstancesMonthlyFee,
        },
      },
    }));

    return transformedFavorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch favorites");
  }
}
