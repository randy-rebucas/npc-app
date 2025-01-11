"use server";

import User, { IUser } from "@/app/models/User";
import connect from "@/lib/db";
import mongoose from "mongoose";

interface GetUsersParams {
  page: number;
  search?: string;
  role?: string;
  limit?: number;
}

interface UserQuery {
  $or?: {
    username?: { $regex: string; $options: string } | string;
    email?: { $regex: string; $options: string } | string;
  }[];
  role?: string;
}

export interface UserDocument {
  _id: string;
  email: string;
  username: string;
  provider: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  metaData?: {
    [key: string]: string;
  };
  profile: {
    _id: string;
    user: string;
    firstName: string;
    lastName: string;
    medicalLicenseStates: string[];
    deaLicenseStates: string[];
    practiceTypes: string[];
    monthlyCollaborationRate: number;
    additionalStateFee: number;
    additionalNPFee: number;
    controlledSubstancesMonthlyFee: number;
    controlledSubstancesPerPrescriptionFee: number;
    description: string;
    boardCertification: string;
    additionalCertifications: string[];
    linkedinProfile: string;
    profilePhotoPath: string;
    governmentIdPath: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    address: string;
    city: string;
    phone: string;
    state: string;
    zip: string;
    clinicalDegree: string;
    education: string[];
    npiNumber: string;
  },
  stripeaccount: {
    _id: string;
    user: string;
    __v: number;
    createdAt: Date;
    stripeAccountId: string;
    updatedAt: Date;
  }
}

interface GetUsersResponse {
  users: {
    id: string;
    username: string;
    email: string;
    role: string;
    provider: string;
    createdAt: Date;
    metaData?: {
      [key: string]: string;
    };
  }[];
  total: number;
}

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
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: "userprofiles",
        localField: "_id",
        foreignField: "user",
        as: "profile",
      }
    },
    {
      $unwind: "$profile"
    },
    {
      $lookup: {
        from: "stripeaccounts",
        localField: "_id",
        foreignField: "user",
        as: "stripeaccount",
      }
    },
    {
      $unwind: "$stripeaccount"
    },
    {
      $lookup: {
        from: "stripeaccounts",
        localField: "_id",
        foreignField: "user",
        as: "stripeaccount",
      }
    },
    {
      $unwind: "$stripeaccount"
    },
    {
      $limit: 1,
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return user[0];
}

export async function getOnboardingStatus(id: string) {
  await connect();
  const user = await User.findById(id);
  return user?.onboardingStatus;
}

export async function createUser(userData: Partial<IUser>) {
  try {
    await connect();
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(userId: string, userData: Partial<IUser>) {
  try {
    await connect();
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true }
    );
    return user;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}

export async function deleteUser(userId: string) {
  try {
    await connect();
    await User.findByIdAndDelete(userId);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function resetPassword(id: string) {
  await connect();
  const user = await User.findByIdAndUpdate(id, { password: "123456" });
  return user;
}

export async function sendInvite(id: string) {
  await connect();
  const user = await User.findByIdAndUpdate(id, { inviteSent: true });
  return user;
}

export async function countUsers(date?: Date) {
  await connect();
  const query = date ? { createdAt: { $lte: date } } : {};

  const count = await User.countDocuments(query);
  return count;
}

export async function getUsers({
  page = 1,
  search = "",
  role = "all",
  limit = 10,
}: GetUsersParams): Promise<GetUsersResponse> {
  try {
    await connect();
    // Build query conditions
    const query: UserQuery = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role !== "all") {
      query.role = role;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [aggregatedUsers, total] = await Promise.all([
      User.aggregate([
        {
          $match: query
        },
        {
          $lookup: {
            from: "userprofiles",
            localField: "_id",
            foreignField: "user",
            as: "profile",
          }
        },
        {
          $unwind: "$profile"
        },
        {
          $lookup: {
            from: "stripeaccounts",
            localField: "_id",
            foreignField: "user",
            as: "stripeaccount",
          }
        },
        {
          $unwind: "$stripeaccount"
        },
        {
          $lookup: {
            from: "stripeaccounts",
            localField: "_id",
            foreignField: "user",
            as: "stripeaccount",
          }
        },
        {
          $unwind: "$stripeaccount"
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $sort: { createdAt: -1 },
        },
      ]),
      User.countDocuments(query),
    ]);

    return {
      users: (aggregatedUsers as unknown as UserDocument[]).map((user) => ({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        provider: user.provider,
        createdAt: user.createdAt,
        metaData: user.metaData,
        profile: user.profile,
        stripeaccount: user.stripeaccount,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}
