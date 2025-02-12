import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export enum ListingStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IListing {
  id: string;
  user: Types.ObjectId | IUser; // Reference to the physician making the offer
  title: string;
  description: string;
  boardCertification: string;
  practiceTypes: string[];
  stateLicenses: string[];
  specialties: string;
  additionalCertifications: string;

  // Pricing
  monthlyBaseRate: number;
  multipleNPFee: number;
  additionalFeePerState: number;
  controlledSubstanceFee: number;

  // Status
  status: ListingStatus;

  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new mongoose.Schema<IListing>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    boardCertification: { type: String, required: true },
    practiceTypes: { type: [String], required: true },
    stateLicenses: { type: [String], required: true },
    specialties: { type: String, required: true },
    additionalCertifications: { type: String, required: true },

    // Pricing
    monthlyBaseRate: { type: Number, required: true },
    multipleNPFee: { type: Number, required: true },
    additionalFeePerState: { type: Number, required: true },
    controlledSubstanceFee: { type: Number, required: true },

    // Status
    status: {
      type: String,
      required: true,
      enum: Object.values(ListingStatus),
      default: ListingStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Listing ||
  mongoose.model<IListing>("Listing", listingSchema);
