import mongoose, { Schema } from "mongoose";

export interface IUser {
  id: string;
  email: string;
  username: string;
  onboardingStatus: "incomplete" | "completed";
  provider: string;
  validated: boolean;
  role: "ADMIN" | "PHYSICIAN";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    onboardingStatus: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    provider: { type: String, required: true },
    validated: { type: Boolean, default: false },
    role: { type: String, enum: ["ADMIN", "PHYSICIAN"], default: "PHYSICIAN" },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User ??
  mongoose.model<IUser>("User", userSchema); 

export default User;
