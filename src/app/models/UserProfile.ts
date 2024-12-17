import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IUserProfile {
  user: Types.ObjectId | IUser;
   // Step 1: User Information
   firstName: string;
   lastName: string;
 
   // Step 2: License Information
   medicalLicenseStates: string[];
   deaLicenseStates: string[];
 
   // Step 3: Clinical Practice Types
   practiceTypes: string[];
 
   // Step 4: Rate Matrix
   monthlyCollaborationRate: number;
   additionalStateFee: number;
   additionalNPFee: number;
   controlledSubstancesMonthlyFee: number;
   controlledSubstancesPerPrescriptionFee: number;
 
   // Step 5: Background & Certifications
   description: string;
   boardCertification: string;
   additionalCertifications: string[];
   linkedinProfile: string;
 
   // Step 6: Profile Photo
  profilePhotoUrl: string;
  governmentIdUrl: string;
}

const userProfileSchema = new Schema<IUserProfile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  medicalLicenseStates: { type: [String], required: true },
  deaLicenseStates: { type: [String], required: true },
  practiceTypes: { type: [String], required: true },
  monthlyCollaborationRate: { type: Number, required: true },
  additionalStateFee: { type: Number, required: true },
  additionalNPFee: { type: Number, required: true },
  controlledSubstancesMonthlyFee: { type: Number, required: true },
  controlledSubstancesPerPrescriptionFee: { type: Number, required: true },
  description: { type: String, required: true },
  boardCertification: { type: String, required: true },
  additionalCertifications: { type: [String], required: true },
  linkedinProfile: { type: String, required: true },
  profilePhotoUrl: { type: String, required: true },
  governmentIdUrl: { type: String, required: true },
}, { timestamps: true });

const UserProfile =
  mongoose.models.UserProfile ??
  mongoose.model<IUserProfile>("UserProfile", userProfileSchema);

export default UserProfile;
