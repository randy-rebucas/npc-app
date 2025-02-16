import connect from "@/lib/db";
import { revalidateTag } from "next/cache";
import Template from "../models/Template";

interface GetTemplatesParams {
  page: number;
  search?: string;
  limit?: number;
}

interface TemplateQuery {
  $or?: {
    name?: { $regex: string; $options: string } | string;
  }[];
}

export interface TemplateDocument {
  _id: string; // We'll cast this to string anyway
  name: string;
  content: string;
  type: string;
  isDefault: boolean;
}

interface GetTemplatesResponse {
  templates: TemplateDocument[];
  total: number;
}

export async function getTemplates({
  page = 1,
  search = "",
  limit = 10,
}: GetTemplatesParams): Promise<GetTemplatesResponse> {
  try {
    await connect();
    // Build query conditions
    const query: TemplateQuery = {};

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [templates, total] = await Promise.all([
      Template.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Template.countDocuments(query),
    ]);

    return {
      templates: (templates as unknown as TemplateDocument[]).map((template) => ({
        _id: template._id.toString(),
        name: template.name,
        content: template.content,
        type: template.type,
        isDefault: template.isDefault,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
}

export async function deleteTemplate(id: string) {
  try {
    await connect();
    await Template.findByIdAndDelete(id);
    revalidateTag('templates') // Update cached templates
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to delete template' };
  }
}
