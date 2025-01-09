"use server";

import connect from "@/lib/db";
import ReportedIssue from "../models/ReportedIssue";
import { revalidateTag } from "next/cache";

interface GetIssuesParams {
  page: number;
  search?: string;
  status?: string;
  limit?: number;
}

interface IssueQuery {
  $or?: {
    email?: { $regex: string; $options: string } | string;
    title?: { $regex: string; $options: string } | string;
  }[];
  status?: string;
}

export interface IssueDocument {
  _id: string; // We'll cast this to string anyway
  email: string;
  title: string;
  description: string;
  status: "pending" | "resolved" | "closed";
  createdAt: Date;
}

interface GetIssuesResponse {
  issues: {
    id: string;
    email: string;
    title: string;
    description: string;
    status: "pending" | "resolved" | "closed";
    createdAt: Date;
  }[];
  total: number;
}

export async function getIssues({
  page = 1,
  search = "",
  status = "all",
  limit = 10,
}: GetIssuesParams): Promise<GetIssuesResponse> {
  try {
    await connect();
    // Build query conditions
    const query: IssueQuery = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== "all") {
      query.status = status;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [issues, total] = await Promise.all([
      ReportedIssue.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      ReportedIssue.countDocuments(query),
    ]);

    return {
      issues: (issues as unknown as IssueDocument[]).map((issue) => ({
        id: issue._id.toString(),
        email: issue.email,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        createdAt: issue.createdAt,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
}

export async function deleteIssue(id: string) {
  try {
    await connect();
    // Perform the deletion logic here, e.g., using a database call
    await ReportedIssue.findByIdAndDelete(id);

    revalidateTag("issues"); // Update cached issues
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete issue" };
  }
}
