import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IPayment {
  _id: string; // Add this line
  user: Types.ObjectId | IUser; 
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paymentIntentId: {
    type: String,
    required: true,
  },
  clientSecret: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Payment =
  mongoose.models.Payment ??
  mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
