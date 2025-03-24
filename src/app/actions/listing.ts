import connect from "@/lib/db";
import Listing from "@/app/models/Listing";
import { selectedItem } from "@/lib/utils";
import { Certification, License } from "@/lib/types/onboarding";
import mongoose from "mongoose";
import { revalidateTag } from "next/cache";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';


export interface ListingDocument {
  _id: string;
  userId: string;
  email: string;
  metaData: {
    calendlyLink: string;
  };
  username: string;
  createdAt: Date;
  title: string;
  description: string;
  boardCertification: string;
  practiceTypes: string[];
  stateLicenses: string[];
  specialties: string;
  monthlyBaseRate: number;
  multipleNPFee: number;
  additionalFeePerState: number;
  controlledSubstanceFee: number;
  status: string;
  profile: {
    _id: string;
    user: string;
    firstName: string;
    lastName: string;
    medicalLicenseStates: License[];
    deaLicenseStates: License[];
    practiceTypes: string[];
    monthlyCollaborationRate: number;
    additionalStateFee: number;
    additionalNPFee: number;
    controlledSubstancesMonthlyFee: number;
    controlledSubstancesPerPrescriptionFee: number;
    description: string;
    boardCertification: string;
    additionalCertifications: Certification[];
    linkedinProfile: string;
    profilePhotoPath: string;
    governmentIdPath: string;
    createdAt: Date;
    updatedAt: Date;
    address: string;
    city: string;
    phone: string;
    state: string;
    zip: string;
    clinicalDegree: string;
    education: string[];
    npiNumber: string;
    title: string;
    publications: string;
  };
}

interface GetListingResponse {
  listings: {
    id: string;
    userId: string;
    username: string;
    email: string;
    metaData: {
      calendlyLink: string;
    };
    createdAt: Date;
    title: string;
    description: string;
    boardCertification: string;
    practiceTypes: string[];
    stateLicenses: string[];
    specialties: string;
    monthlyBaseRate: number;
    multipleNPFee: number;
    additionalFeePerState: number;
    controlledSubstanceFee: number;
    status: string;
    profile: {
      firstName?: string;
      lastName?: string;
      profilePhotoPath?: string;
    };
  }[];
  total: number;
}

interface ListingQuery {
  $or?: {
    username?: { $regex: string; $options: string } | string;
    email?: { $regex: string; $options: string } | string;
    "profile.firstName"?: { $regex: string; $options: string } | string;
    "profile.lastName"?: { $regex: string; $options: string } | string;
  }[];
  status?: string;
  stateLicenses?: { $in: string[] };
  practiceTypes?: { $in: string[] };
  monthlyBaseRate?: { $gte: number; $lte: number };
}

export async function getListings({
  page = 1,
  search = "",
  limit = 10,
  sort = "lowest_price",
  status = "all",
  stateLicense = "",
  practiceType = "",
  priceRange = "",
}: {
  page?: number;
  search?: string;
  limit?: number;
  sort?: "lowest_price" | "highest_price" | "most_recent";
  status?: string;
  stateLicense?: string;
  practiceType?: string;
  priceRange?: string;
}): Promise<GetListingResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const query: ListingQuery = {};

      if (search) {
        query.$or = [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { "profile.firstName": { $regex: search, $options: "i" } },
          { "profile.lastName": { $regex: search, $options: "i" } },
        ];
      }

      if (status !== "all") {
        query.status = status;
      }

      if (stateLicense) {
        const states = stateLicense.split(",").map((state) => state.trim());
        query.stateLicenses = { $in: states };
      }

      if (practiceType) {
        const practiceTypes = practiceType.split(",").map((type) => type.trim());
        query.practiceTypes = { $in: practiceTypes };
      }

      if (priceRange) {
        const [min, max] = priceRange.split(",").map(Number);
        query.monthlyBaseRate = { $gte: min, $lte: max };
      }

      const skip = (page - 1) * limit;
      const sortConfig = {
        lowest_price: { monthlyBaseRate: 1 },
        highest_price: { monthlyBaseRate: -1 },
        most_recent: { createdAt: -1 },
      } as const;

      const [aggregatedListings, total] = await Promise.all([
        Listing.aggregate([
          { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
          { $unwind: "$user" },
          { $lookup: { from: "userprofiles", localField: "user._id", foreignField: "user", as: "profile" } },
          { $unwind: "$profile" },
          { $match: query },
          { $sort: sortConfig[sort] || { monthlyBaseRate: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              userId: "$user._id",
              username: "$user.username",
              email: "$user.email",
              metaData: "$user.metaData",
              profile: 1,
              _id: "$_id",
              title: "$title",
              description: "$description",
              boardCertification: "$boardCertification",
              practiceTypes: "$practiceTypes",
              stateLicenses: "$stateLicenses",
              specialties: "$specialties",
              monthlyBaseRate: "$monthlyBaseRate",
              multipleNPFee: "$multipleNPFee",
              additionalFeePerState: "$additionalFeePerState",
              controlledSubstanceFee: "$controlledSubstanceFee",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        ]),
        Listing.countDocuments(),
      ]);

      return {
        listings: aggregatedListings.map((listing) => ({
          id: listing._id.toString(),
          userId: listing.userId,
          username: listing.username,
          email: listing.email,
          metaData: listing.metaData,
          createdAt: listing.createdAt,
          title: listing.title,
          description: listing.description,
          boardCertification: listing.boardCertification,
          practiceTypes: listing.practiceTypes,
          stateLicenses: listing.stateLicenses,
          specialties: listing.specialties,
          monthlyBaseRate: listing.monthlyBaseRate,
          multipleNPFee: listing.multipleNPFee,
          additionalFeePerState: listing.additionalFeePerState,
          controlledSubstanceFee: listing.controlledSubstanceFee,
          status: listing.status,
          profile: selectedItem(listing.profile, [
            "firstName",
            "lastName",
            "profilePhotoPath",
          ]),
        })),
        total: total || 0,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch listings: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No listings found');
  }

  return result;
}

export async function getListingById(id: string): Promise<ListingDocument> {
  if (!id) {
    throw new ValidationError('Listing ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const listing = await Listing.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $lookup: { from: "userprofiles", localField: "user._id", foreignField: "user", as: "profile" } },
        { $unwind: "$profile" },
        { $limit: 1 },
        {
          $project: {
            userId: "$user._id",
            username: "$user.username",
            email: "$user.email",
            metaData: "$user.metaData",
            profile: 1,
            _id: "$_id",
            title: "$title",
            description: "$description",
            boardCertification: "$boardCertification",
            practiceTypes: "$practiceTypes",
            stateLicenses: "$stateLicenses",
            specialties: "$specialties",
            monthlyBaseRate: "$monthlyBaseRate",
            multipleNPFee: "$multipleNPFee",
            additionalFeePerState: "$additionalFeePerState",
            controlledSubstanceFee: "$controlledSubstanceFee",
            status: "$status",
            createdAt: "$createdAt",
          },
        },
      ]);

      if (!listing || listing.length === 0) {
        throw new ValidationError(`Listing with ID ${id} not found`);
      }

      return {
        _id: listing[0]._id.toString(),
        userId: listing[0].userId.toString(),
        email: listing[0].email,
        metaData: listing[0].metaData,
        username: listing[0].username,
        createdAt: listing[0].createdAt,
        title: listing[0].title,
        description: listing[0].description,
        boardCertification: listing[0].boardCertification,
        practiceTypes: listing[0].practiceTypes,
        stateLicenses: listing[0].stateLicenses,
        specialties: listing[0].specialties,
        monthlyBaseRate: listing[0].monthlyBaseRate,
        multipleNPFee: listing[0].multipleNPFee,
        additionalFeePerState: listing[0].additionalFeePerState,
        controlledSubstanceFee: listing[0].controlledSubstanceFee,
        status: listing[0].status,
        profile: listing[0].profile,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch listing: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No listing found');
  }

  return result;
}

export async function deleteListing(id: string) {
  if (!id) {
    throw new ValidationError('Listing ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const listing = await Listing.findByIdAndDelete(id);
      if (!listing) {
        throw new ValidationError(`Listing with ID ${id} not found`);
      }
      revalidateTag("listings");
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete listing: ${error.message}`);
  }

  return result;
}
