"use server";

import User, { IUser } from "@/app/models/User";
import connect from "@/lib/db";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { selectedItem } from "@/lib/utils";
import { Certification, License } from "@/lib/types/onboarding";
import { handleAsync, handleError } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

interface GetUsersParams {
  page: number;
  search?: string;
  role?: string;
  limit?: number;
}

interface licenseState {
  state: string;
}

export interface UserQuery {
  $or?: {
    username?: { $regex: string; $options: string } | string;
    email?: { $regex: string; $options: string } | string;
    "profile.firstName"?: { $regex: string; $options: string } | string;
    "profile.lastName"?: { $regex: string; $options: string } | string;
  }[];
  role?: string;
  "profile.medicalLicenseStates"?: { $in: licenseState[] };
  "profile.practiceTypes"?: { $in: string[] };
  "profile.monthlyCollaborationRate"?: { $gte: number; $lte: number };
}

export interface UserDocument {
  _id: string;
  email: string;
  username: string;
  provider: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  onBoardingStatus: string;
  submissionStatus: string;
  metaData?: {
    [key: string]: string;
  };
  profile: {
    // _id: string;
    user: string;
    firstName: string;
    lastName: string;
    medicalLicenseStates: License[];
    deaLicenseStates: License[];
    practiceTypes: string[];
    monthlyCollaborationRate: number;
    additionalStateFee: number;
    additionalNPFee: number;
    controlledSubstancesMonthlyFee: number;
    controlledSubstancesPerPrescriptionFee: number;
    description: string;
    boardCertification: string;
    additionalCertifications: Certification[];
    linkedinProfile: string;
    profilePhotoPath: string;
    governmentIdPath: string;
    createdAt: Date;
    updatedAt: Date;
    address: string;
    city: string;
    phone: string;
    state: string;
    zip: string;
    clinicalDegree: string;
    education: string[];
    npiNumber: string;
    title: string;
    publications: string;
  };
}

interface GetUsersResponse {
  users: {
    id: string;
    username: string;
    email: string;
    role: string;
    provider: string;
    createdAt: Date;
    onBoardingStatus: string;
    submissionStatus: string;
    metaData?: {
      [key: string]: string;
    };
  }[];
  total: number;
}

export async function getUserByEmail(email: string) {
  if (!email) {
    throw new ValidationError('Email is required');
  }

  const [user, error] = await handleAsync(
    User.aggregate([
      {
        $match: { email },
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
          profile: { $first: "$profile" },
        },
      },
      { $limit: 1 },
    ])
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch user: ${error.message}`);
  }

  if (!user || user.length === 0) {
    throw new NotFoundError(`User with email ${email} not found`);
  }

  return user[0];
}

export async function getUserById(id: string): Promise<UserDocument> {
  await connect();
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
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
      $unwind: "$profile",
    },
    {
      $limit: 1,
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  const transformedUser = {
    _id: user[0]._id.toString(),
    email: user[0].email,
    username: user[0].username,
    provider: user[0].provider,
    role: user[0].role,
    createdAt: user[0].createdAt,
    updatedAt: user[0].updatedAt,
    onBoardingStatus: user[0].onBoardingStatus,
    submissionStatus: user[0].submissionStatus,
    metaData: user[0].metaData,
    profile: selectedItem(user[0].profile, [
      "firstName",
      "lastName",
      "medicalLicenseStates",
      "deaLicenseStates",
      "practiceTypes",
      "monthlyCollaborationRate",
      "additionalStateFee",
      "additionalNPFee",
      "controlledSubstancesMonthlyFee",
      "controlledSubstancesPerPrescriptionFee",
      "description",
      "title",
      "publications",
      "boardCertification",
      "additionalCertifications",
      "linkedinProfile",
      "profilePhotoPath",
      "governmentIdPath",
      "createdAt",
      "updatedAt",
      "address",
      "city",
      "phone",
      "state",
      "zip",
      "clinicalDegree",
      "education",
      "npiNumber",
    ]) as UserDocument["profile"],
  };
  return transformedUser;
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
    
    if (page < 1 || limit < 1) {
      throw new ValidationError('Invalid pagination parameters');
    }

    const query: UserQuery = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    console.log(role);
    if (role !== "all") {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const [result, error] = await handleAsync(Promise.all([
      User.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "userprofiles",
            localField: "_id",
            foreignField: "user",
            as: "profile",
          },
        },
        { $unwind: "$profile" },
        { $skip: skip },
        { $limit: limit },
        { $sort: { createdAt: -1 } },
      ]),
      User.countDocuments(query),
    ]));

    if (error) {
      throw new DatabaseError(`Failed to fetch users: ${error.message}`);
    }

    const [aggregatedUsers, total] = result || [];

    return {
      users: (aggregatedUsers as UserDocument[]).map((user: UserDocument) => ({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        provider: user.provider,
        createdAt: user.createdAt,
        onBoardingStatus: user.onBoardingStatus,
        submissionStatus: user.submissionStatus,
        metaData: user.metaData,
        profile: user.profile,
      })),
      total: total || 0,
    };
  } catch (error) {
    throw handleError(error);
  }
}

export async function getNpUsers({
  page = 1,
  search = "",
  limit = 10,
  sort = "lowest_price",
  stateLicense = "",
  practiceType = "",
  priceRange = "",
}: {
  page?: number;
  search?: string;
  limit?: number;
  sort?: "lowest_price" | "highest_price" | "most_recent";
  stateLicense?: string;
  practiceType?: string;
  priceRange?: string;
}): Promise<GetUsersResponse> {
  try {
    const session = await getServerSession(authOptions);

    await connect();

    const query: UserQuery = {
      role:
        session?.user?.role === "NURSE_PRACTITIONER"
          ? "PHYSICIAN"
          : "NURSE_PRACTITIONER", // Ensure we only get NP users
    };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "profile.firstName": { $regex: search, $options: "i" } },
        { "profile.lastName": { $regex: search, $options: "i" } },
      ];
    }

    if (stateLicense) {
      const states = stateLicense.split(",").map((state) => state.trim());
      query["profile.medicalLicenseStates"] = {
        $in: states.map((state) => ({ state: state })),
      };
    }

    if (practiceType) {
      const practiceTypes = practiceType.split(",").map((type) => type.trim());
      query["profile.practiceTypes"] = {
        $in: practiceTypes,
      };
    }

    if (priceRange) {
      const [min, max] = priceRange.split(",").map(Number);
      query["profile.monthlyCollaborationRate"] = { $gte: min, $lte: max };
    }

    const skip = (page - 1) * limit;

    const sortConfig = {
      lowest_price: { "profile.monthlyCollaborationRate": 1 },
      highest_price: { "profile.monthlyCollaborationRate": -1 },
      most_recent: { createdAt: -1 },
    } as const;

    const [aggregatedUsers, total] = await Promise.all([
      User.aggregate([
        {
          $lookup: {
            from: "userprofiles",
            localField: "_id",
            foreignField: "user",
            as: "profile",
          },
        },
        {
          $unwind: "$profile",
        },
        {
          $match: query, // Move $match after $lookup to filter on profile fields
        },
        {
          $sort: sortConfig[sort] || { "profile.monthlyCollaborationRate": 1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),
      User.aggregate([
        {
          $lookup: {
            from: "userprofiles",
            localField: "_id",
            foreignField: "user",
            as: "profile",
          },
        },
        {
          $unwind: "$profile",
        },
        {
          $match: query,
        },
        {
          $count: "total",
        },
      ]),
    ]);

    return {
      users: (aggregatedUsers as UserDocument[]).map((user) => ({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        provider: user.provider,
        createdAt: user.createdAt,
        onBoardingStatus: user.onBoardingStatus,
        submissionStatus: user.submissionStatus,
        metaData: user.metaData,
        profile: selectedItem(user.profile, [
          "firstName",
          "lastName",
          "medicalLicenseStates",
          "deaLicenseStates",
          "practiceTypes",
          "monthlyCollaborationRate",
          "additionalStateFee",
          "additionalNPFee",
          "controlledSubstancesMonthlyFee",
          "controlledSubstancesPerPrescriptionFee",
          "description",
          "title",
          "publications",
          "boardCertification",
          "additionalCertifications",
          "linkedinProfile",
          "profilePhotoPath",
          "governmentIdPath",
          "createdAt",
          "updatedAt",
          "address",
          "city",
          "phone",
          "state",
          "zip",
          "clinicalDegree",
          "education",
          "npiNumber",
          "title",
          "publications",
        ]),
      })),
      total: total[0]?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}
