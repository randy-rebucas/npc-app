import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IPayment {
  _id: string; // Add this line
  user: Types.ObjectId | IUser; 
  amount: number;
  status: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: {
    type: Number,
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
