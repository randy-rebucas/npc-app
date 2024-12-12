import { unstable_noStore as noStore } from "next/cache";
import Member from "@/app/models/Member";
import connect from "@/lib/db";
import mongoose from "mongoose";
import User from "@/app/models/User";

const ITEMS_PER_PAGE = 6;

export async function getMembers() {
  try {
    connect();

    const members = await Member.find({});

    const transformData = members.map((member) => {
      return {
        _id: member._id.toString(),
        event: member.event,
        email: member.payload.email,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      };
    });
  
    return transformData;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all members.");
  }
}

export async function fetchFilteredMembers(
  query: string,
  currentPage: number,
) {
  connect();

  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const member = await User.findById(new mongoose.Types.ObjectId('6756df2278d7d8a2d5b93400')).exec()
    console.log(member);

    const members = await Member.find({
      email: { $regex: query, $options: 'i' }
    }).skip(offset).limit(ITEMS_PER_PAGE).exec();

    const transformData = members.map((member) => ({
      _id: member._id.toString(),
      event: member.event,
      email: member.payload.email,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    }));

    return transformData;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch members.");
  }
}

export async function getMembersPages(query: string) {
  connect();

  noStore();
  try {
    const count = await Member.countDocuments({
      email: { $regex: query, $options: 'i' }
    }).exec();
    
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to fetch total number of members.`);
  }
}

