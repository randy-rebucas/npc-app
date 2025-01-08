import connect from "@/lib/db";
import MedicalLicenseState, { IMedicalLicenseState } from "../models/MedicalLicenseState";

export async function getMedicalLicenseStates() {
  await connect();
  const medicalLicenseStates = await MedicalLicenseState.find({}).exec();
  const transformedMedicalLicenseStates = medicalLicenseStates.filter(state => state.enabled === true).map(state => state.state);
  return transformedMedicalLicenseStates;
}

interface GetMedicalLicenseStatesParams {
  page: number;
  search?: string;
  limit?: number;
  enabled?: string;
}

interface MedicalLicenseStateQuery {
  $or?: {
    state?: { $regex: string; $options: string } | string;
  }[];
  enabled?: boolean;
}

interface GetMedicalLicenseStatesResponse {
  medicalLicenseStates: IMedicalLicenseState[]; 
  total: number;
}

export async function getMedicalLicenseStatesPaginated({
  page = 1,
  search = "",
  limit = 10,
  enabled = "all",
}: GetMedicalLicenseStatesParams): Promise<GetMedicalLicenseStatesResponse> {
  try {
    await connect();
    // Build query conditions
    const query: MedicalLicenseStateQuery = {};

    if (search) {
      query.$or = [{ state: { $regex: search, $options: "i" } }];
    }

    if (enabled !== "all") {
      query.enabled = enabled === "true" ? true : false;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [medicalLicenseStates, total] = await Promise.all([
      MedicalLicenseState.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      MedicalLicenseState.countDocuments(query),
    ]);

    return {
      medicalLicenseStates: (medicalLicenseStates as unknown as IMedicalLicenseState[]).map((medicalLicenseState) => ({
        _id: medicalLicenseState._id.toString(),
        state: medicalLicenseState.state,
        enabled: medicalLicenseState.enabled,
      })),
      total,
    };
  } catch (error) {
      console.error("Error fetching medical license states:", error);
    throw error;
  }
}