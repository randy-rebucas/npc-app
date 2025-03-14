import connect from "@/lib/db";
import Favorite from "../models/Favorite";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import mongoose from "mongoose";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, ValidationError } from '@/lib/errors';

export async function getFavorites() {
  const [session, sessionError] = await handleAsync(getServerSession(authOptions));

  if (sessionError || !session?.user?.id) {
    throw new ValidationError("User not authenticated");
  }

  const [result, error] = await handleAsync(
    (async () => {
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

      return favorites.map((favorite) => ({
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
            monthlyCollaborationRate: favorite.physicianUser.profile.monthlyCollaborationRate,
            additionalStateFee: favorite.physicianUser.profile.additionalStateFee,
            additionalNPFee: favorite.physicianUser.profile.additionalNPFee,
            controlledSubstancesMonthlyFee: favorite.physicianUser.profile.controlledSubstancesMonthlyFee,
          },
        },
      }));
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch favorites: ${error.message}`);
  }

  return result;
}
