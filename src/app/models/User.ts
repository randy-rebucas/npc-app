import mongoose, { Schema } from "mongoose";

export interface IUser {
  id: string;
  email: string;
  username: string;
  provider: string;
  role: "ADMIN" | "PHYSICIAN";
  createdAt: Date;
  updatedAt: Date;
  onBoardingStatus: "COMPLETED" | "INCOMPLETE";
  submissionStatus: "PENDING" | "APPROVED" | "REJECTED" | "INCOMPLETE" | "INCORRECT";
  metaData: Map<string, string>;
  stripeAccountId: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "PHYSICIAN"], default: "PHYSICIAN" },
    onBoardingStatus: {
      type: String,
      enum: ["COMPLETED", "INCOMPLETE"],
      default: "INCOMPLETE",
    },
    submissionStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "INCOMPLETE", "INCORRECT"],
      default: "PENDING",
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
