"use server";

import Member from "../models/Member";
import connect from "@/lib/db";
import User, { IUser } from "../models/User";

export async function countMembers() {
  connect();
  const count = await Member.countDocuments().exec();
  return count;
}

export async function getUserByEmail(email: string) {
  connect();
  const user = await User.findOne({ email: email }).exec();
  return user;
}

export async function createUser(user: IUser) {
  connect();
  const newUser = await User.create(user);
  return newUser;
}

export async function updateUser(id: string, user: IUser) {
  connect();
  const updatedUser = await User.findByIdAndUpdate(id, user, {
    new: true,
  }).exec();
  return updatedUser;
}

export async function deleteUser(id: string) {
  connect();
  const deletedUser = await User.findByIdAndDelete(id).exec();
  return deletedUser;
}

interface GetMembersParams {
  page: number;
  search?: string;
  accountSynced?: string;
  limit?: number;
}

interface MemberQuery {
  $or?: {
    event?: { $regex: string; $options: string } | string;
  }[];
  accountSynced?: string;
}

export interface MemberDocument {
  _id: string; // We'll cast this to string anyway
  event: string;
  payload: {
    auth: {
      email: string;
    };
  };
  accountSynced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface GetMembersResponse {
  members: {
    id: string;
    event: string;
    email: string;
    accountSynced: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
  total: number;
}

export async function getMembers({ 
  page = 1,
  search = "",
  accountSynced = "all",
  limit = 10,
}: GetMembersParams): Promise<GetMembersResponse> {
  try {
    await connect();
    // Build query conditions
    const query: MemberQuery = {};

    if (search) {
      query.$or = [
        { event: { $regex: search, $options: "i" } },
      ];
    }

    if (accountSynced !== "all") {
      query.accountSynced = accountSynced;
    }


    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      Member.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Member.countDocuments(query),
    ]);

    return {
      members: (members as unknown as MemberDocument[]).map((member) => ({
        id: member._id.toString(),
        event: member.event,
        email: member.payload.auth.email,
        accountSynced: member.accountSynced,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}
