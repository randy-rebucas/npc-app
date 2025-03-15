import mongoose, { Schema, Document, Types } from "mongoose";

export enum UserRole {
  ADMIN = 'ADMIN',
  PHYSICIAN = 'PHYSICIAN',
  NURSE_PRACTITIONER = 'NURSE_PRACTITIONER'
}

export enum UserOnBoardingStatus {
  COMPLETED = 'COMPLETED',
  INCOMPLETE = 'INCOMPLETE'
}

export enum UserSubmissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INCOMPLETE = 'INCOMPLETE',
  INCORRECT = 'INCORRECT'
}

export interface IUser extends Document {
  id: string;
  email: string;
  username: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  onBoardingStatus: UserOnBoardingStatus;
  submissionStatus: UserSubmissionStatus;
  metaData: Map<string, string>;
  stripeAccountId: string;
  role?: string | undefined;
  canCreateListings: boolean;
  sharetribeToken?: string;
  sharetribeUserId?: string;
}


const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
    role: { type: Types.ObjectId, ref: "Role" },
    onBoardingStatus: {
      type: String,
      enum: Object.values(UserOnBoardingStatus),
      default: UserOnBoardingStatus.INCOMPLETE,
    },
    submissionStatus: {
      type: String,
      enum: Object.values(UserSubmissionStatus),
      default: UserSubmissionStatus.PENDING,
    },
    stripeAccountId: { type: String, default: "" },
    canCreateListings: { type: Boolean, default: false },
    metaData: {
      type: Map,
      of: String,
    },
    sharetribeToken: { type: String, default: "" },
    sharetribeUserId: { type: String, default: "" },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User ??
  mongoose.model<IUser>("User", userSchema);

export default User;