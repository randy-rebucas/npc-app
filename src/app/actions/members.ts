"use server";

import Member from "../models/Member";
import connect from "@/lib/db";
import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

interface CountMemberQuery {
  createdAt?: { $lte: Date };
  accountSynced?: string;
}

export async function syncMember(id: string) {
  if (!id) {
    throw new ValidationError('Member ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const member = await Member.findById(id).exec();
      if (!member) {
        throw new ValidationError(`Member with ID ${id} not found`);
      }
      const sharetribeUser = await MemberstackAdminService.getMemberById(member.payload.auth.id);
      console.log(sharetribeUser);
      console.log(member);
      return member;
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to sync member: ${error.message}`);
  }

  return result;
}

export async function countMembers(date?: Date, sync?: string) {
  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: CountMemberQuery = date ? { createdAt: { $lte: date } } : {};
      if (sync) {
        query.accountSynced = sync;
      }
      return await Member.countDocuments(query).exec();
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to count members: ${error.message}`);
  }

  return result;
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
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: MemberQuery = {};

      if (search) {
        query.$or = [{ event: { $regex: search, $options: "i" } }];
      }

      if (accountSynced !== "all") {
        query.accountSynced = accountSynced;
      }

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
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch members: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No members found');
  }

  return result;
}
