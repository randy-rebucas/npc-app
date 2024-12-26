"use server";

import User, { IUser } from "@/app/models/User";
import connect from "@/lib/db";

interface GetUsersParams {
  page: number;
  search?: string;
  role?: string;
  onboardingStatus?: string;
  limit?: number;
}

interface UserQuery {
  $or?: {
    username?: { $regex: string; $options: string } | string;
    email?: { $regex: string; $options: string } | string;
  }[];
  role?: string;
  onboardingStatus?: string;
}

export interface UserDocument {
  _id: string; // We'll cast this to string anyway
  username: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  provider: string;
  onboardingStatus: "incomplete" | "completed";
  createdAt: Date;
}

interface GetUsersResponse {
  users: {
    id: string;
    username: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
    provider: string;
    onboardingStatus: "incomplete" | "completed";
    createdAt: Date;
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
  const user = await User.findById(id);
  return user;
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

export async function getUsers({
  page = 1,
  search = "",
  role = "all",
  onboardingStatus = "all",
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

    if (onboardingStatus !== "all") {
      query.onboardingStatus = onboardingStatus;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      User.countDocuments(query),
    ]);

    return {
      users: (users as unknown as UserDocument[]).map((user) => ({
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        provider: user.provider,
        onboardingStatus: user.onboardingStatus,
        createdAt: user.createdAt,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}
