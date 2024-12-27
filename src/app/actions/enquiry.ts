"use server";

import Enquiry from "../models/Enquiry";
import connect from "@/lib/db";

interface GetEnquiriesParams {
  page: number;
  search?: string;
  status?: string;
  limit?: number;
}

interface EnquiryQuery {
  $or?: {
    email?: { $regex: string; $options: string } | string;
    subject?: { $regex: string; $options: string } | string;
  }[];
  status?: string;
}

export interface EnquiryDocument {
  _id: string; // We'll cast this to string anyway
  email: string;
  subject: string;
  message: string;
  status: "pending" | "resolved" | "closed";
  createdAt: Date;
}

interface GetEnquiriesResponse {
  enquiries: {
    id: string;
    email: string;
    subject: string;
    message: string;
    status: "pending" | "resolved" | "closed";
    createdAt: Date;
  }[];
  total: number;
}

export async function getEnquiries({
  page = 1,
  search = "",
  status = "all",
  limit = 10,
}: GetEnquiriesParams): Promise<GetEnquiriesResponse> {
  try {
    await connect();
    // Build query conditions
    const query: EnquiryQuery = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== "all") {
      query.status = status;
    }


    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Enquiry.countDocuments(query),
    ]);

    return {
      enquiries: (enquiries as unknown as EnquiryDocument[]).map((enquiry) => ({
        id: enquiry._id.toString(),
        email: enquiry.email,
        subject: enquiry.subject,
        message: enquiry.message,
        status: enquiry.status,
        createdAt: enquiry.createdAt,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    throw error;
  }
}
