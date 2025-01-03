import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  onboardingStatus: "incomplete" | "completed";
  provider: string;
  validated: boolean;
  role: "ADMIN" | "CUSTOMER";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    onboardingStatus: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    provider: { type: String, required: true },
    validated: { type: Boolean, default: false },
    role: { type: String, enum: ["ADMIN", "CUSTOMER"], default: "CUSTOMER" },
  },
  { timestamps: true }
);

const User =
  mongoose.models.Users ?? mongoose.model<IUser>("Users", userSchema);

export default User;

User.prototype.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};
