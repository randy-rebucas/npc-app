"use server";

import Member from "../models/Member";
import connect from "@/lib/db";
import { MemberstackAdminService } from "@/utils/memberstack-admin";

interface CountMemberQuery {
  createdAt?: { $lte: Date };
  accountSynced?: string;
}

export async function syncMember(id: string) {
  try {
    await connect();
    const member = await Member.findById(id).exec();
    if (!member) {
      return false;
    }
    const sharetribeUser = await MemberstackAdminService.getMemberById(member.payload.auth.id);
    console.log(sharetribeUser);

    // const customFields = {
    //   firstName: member.payload.customFields["first-name"] || "User",
    //   lastName: member.payload.customFields["last-name"] || "Name",
    //   displayName: member.payload.customFields["display-name"],
    // };

    // const sharetribePayload = {
    //   email: member.payload.auth.email,
    //   password: generatePassword(),
    //   firstName: customFields.firstName,
    //   lastName: customFields.lastName,
    //   displayName:
    //     customFields.displayName ||
    //     `${customFields.firstName} ${customFields.lastName}`,
    //   protectedData: {},
    //   publicData: {},
    // };
    console.log(member);
    return member;
  } catch (error) {
    console.error("Error syncing member:", error);
    throw new Error("Failed to sync member");
  }
}

export async function countMembers(date?: Date, sync?: string) {
  connect();
  const query: CountMemberQuery = date ? { createdAt: { $lte: date } } : {};
  if (sync) {
    query.accountSynced = sync;
  }
  const count = await Member.countDocuments(query).exec();
  return count;
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
    id: string;
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
      query.$or = [{ event: { $regex: search, $options: "i" } }];
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
        memberstackId: member.payload.id,
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
