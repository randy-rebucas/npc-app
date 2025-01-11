import mongoose, { Schema } from "mongoose";

export interface IUser {
  id: string;
  email: string;
  username: string;
  provider: string;
  role: "ADMIN" | "PHYSICIAN";
  createdAt: Date;
  updatedAt: Date;
  metaData?: {
    [key: string]: string; // This will be used to store any additional metadata about the user such validated, submited, signed agreement, etc.
  };
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "PHYSICIAN"], default: "PHYSICIAN" },
    metaData: { type: Object, default: {} },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);

export default User;
