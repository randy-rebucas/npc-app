import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  _id: String,
  email: String,
  firstName: String,
  lastName: String,
  createdAt: Date,
  updatedAt: Date,
});

const User =
  mongoose.models.Users ?? mongoose.model<IUser>("Users", userSchema);

export default User;
