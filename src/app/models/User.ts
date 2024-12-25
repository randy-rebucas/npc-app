import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  onboardingStatus: string;
  provider: string;
  role: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    onboardingStatus: { type: String, default: "incomplete" },
    provider: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

const User =
  mongoose.models.Users ?? mongoose.model<IUser>("Users", userSchema);

export default User;

User.prototype.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

