import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export enum ListingCategory {
  PHYSICIAN = "PHYSICIAN",
  NURSE_PRACTITIONER = "NURSE_PRACTITIONER",
}

export enum ListingStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IListing {
  id: string;
  user: Types.ObjectId | IUser; // Reference to the physician making the offer
  category: ListingCategory;
  title: string;
  description: string;
  boardCertification: string;
  practiceType: string;
  practiceName: string;
  stateLicenses: string;
  specialties: string;
  additionalCertifications: string;

  // Pricing
  baseRate: number;
  multipleNPFee: number;
  additionalFeePerState: number;
  controlledSubstanceFee: number;

  // Status
  status: ListingStatus;
}

const listingSchema = new mongoose.Schema<IListing>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true, enum: Object.values(ListingCategory) },
  title: { type: String, required: true },
  description: { type: String, required: true },
  boardCertification: { type: String, required: true },
  practiceType: { type: String, required: true },
  practiceName: { type: String, required: true },
  stateLicenses: { type: String, required: true },
  specialties: { type: String, required: true },
  additionalCertifications: { type: String, required: true },

  // Pricing
  baseRate: { type: Number, required: true },
  multipleNPFee: { type: Number, required: true },
  additionalFeePerState: { type: Number, required: true },
  controlledSubstanceFee: { type: Number, required: true },

  // Status
  status: { type: String, required: true, enum: Object.values(ListingStatus) },
});

export default mongoose.models.Listing ||
  mongoose.model<IListing>("Listing", listingSchema);
