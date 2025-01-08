import connect from "@/lib/db";
import Faq from "../models/Faq";

interface GetFaqsParams {
  page: number;
  search?: string;
  limit?: number;
}

interface FaqQuery {
  $or?: {
    question?: { $regex: string; $options: string } | string;
  }[];
}

export interface FaqDocument {
  _id: string; // We'll cast this to string anyway
  question: string;
  answer: string;
}

interface GetFaqsResponse {
  faqs: FaqDocument[];
  total: number;
}

export async function getFaqs({
  page = 1,
  search = "",
  limit = 10,
}: GetFaqsParams): Promise<GetFaqsResponse> {
  try {
    await connect();
    // Build query conditions
    const query: FaqQuery = {};

    if (search) {
      query.$or = [{ question: { $regex: search, $options: "i" } }];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [faqs, total] = await Promise.all([
      Faq.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Faq.countDocuments(query),
    ]);

    return {
      faqs: (faqs as unknown as FaqDocument[]).map((faq) => ({
        _id: faq._id.toString(),
        question: faq.question,
        answer: faq.answer,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching faqs:", error);
    throw error;
  }
}
