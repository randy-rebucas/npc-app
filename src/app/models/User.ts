import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User =
  mongoose.models.Users ?? mongoose.model<IUser>("Users", userSchema);

export default User;
