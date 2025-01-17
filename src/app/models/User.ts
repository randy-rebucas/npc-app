import mongoose, { Schema, Document } from "mongoose";

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
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  onBoardingStatus: UserOnBoardingStatus;
  submissionStatus: UserSubmissionStatus;
  metaData: Map<string, string>;
  stripeAccountId: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.PHYSICIAN },
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
    metaData: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);

export default User;
