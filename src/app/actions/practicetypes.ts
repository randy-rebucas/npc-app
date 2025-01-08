import connect from "@/lib/db";
import PracticeType, { IPracticeType } from "../models/PracticeType";

export async function getPracticeTypes() {
  await connect();
  const practiceTypes = await PracticeType.find({}).exec();
  const transformedPracticeTypes = practiceTypes.filter((type) => type.enabled === true).map((type) => type.type);
  return transformedPracticeTypes;
}

interface GetPracticeTypesParams {
  page: number;
  search?: string;
  limit?: number;
  enabled?: string;
}

interface PracticeTypeQuery {
  $or?: {
    type?: { $regex: string; $options: string } | string;
  }[];
  enabled?: boolean;
}

interface GetPracticeTypesResponse {
  practiceTypes: IPracticeType[]; 
  total: number;
}

export async function getPracticeTypesPaginated({
  page = 1,
  search = "",
  limit = 10,
  enabled = "all",
}: GetPracticeTypesParams): Promise<GetPracticeTypesResponse> {
  try {
    await connect();
    // Build query conditions
    const query: PracticeTypeQuery = {};

    if (search) {
      query.$or = [{ type: { $regex: search, $options: "i" } }];
    }

    if (enabled !== "all") {
      query.enabled = enabled === "true" ? true : false;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [practiceTypes, total] = await Promise.all([
      PracticeType.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      PracticeType.countDocuments(query),
    ]);

    return {
      practiceTypes: (practiceTypes as unknown as IPracticeType[]).map((practiceType) => ({
        _id: practiceType._id.toString(),
        type: practiceType.type,
        enabled: practiceType.enabled,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching practice types:", error);
    throw error;
  }
}
