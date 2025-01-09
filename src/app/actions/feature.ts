"use server";

import connect from "@/lib/db";
import RequestedFeature from "../models/RequesedtFeature";
import { revalidateTag } from "next/cache";

interface GetFeaturesParams {
  page: number;
  search?: string;
  status?: string;
  limit?: number;
}

interface FeatureQuery {
  $or?: {
    email?: { $regex: string; $options: string } | string;
    title?: { $regex: string; $options: string } | string;
  }[];
  status?: string;
}

export interface FeatureDocument {
  _id: string; // We'll cast this to string anyway
  email: string;
  title: string;
  description: string;
  status: "pending" | "resolved" | "closed";
  createdAt: Date;
}

interface GetFeaturesResponse {
  features: {
    id: string;
    email: string;
    title: string;
    description: string;
    status: "pending" | "resolved" | "closed";
    createdAt: Date;
  }[];
  total: number;
}

export async function getFeatures({
  page = 1,
  search = "",
  status = "all",
  limit = 10,
}: GetFeaturesParams): Promise<GetFeaturesResponse> {
  try {
    await connect();
    // Build query conditions
    const query: FeatureQuery = {};

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

    const [features, total] = await Promise.all([
      RequestedFeature.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      RequestedFeature.countDocuments(query),
    ]);

    return {
      features: (features as unknown as FeatureDocument[]).map((feature) => ({
        id: feature._id.toString(),
        email: feature.email,
        title: feature.title,
        description: feature.description,
        status: feature.status,
        createdAt: feature.createdAt,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching features:", error);
    throw error;
  }
}

export async function deleteFeature(id: string) {

  try {
      await connect();
      // Perform the deletion logic here, e.g., using a database call
      await RequestedFeature.findByIdAndDelete(id);
    
      revalidateTag('features') // Update cached features
      return { success: true };
  } catch (error) {
      console.error(error);
      return { error: 'Failed to delete feature' };
  }
}
