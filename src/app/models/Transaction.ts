import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface ITransaction {
  _id: string; // Add this line
  user: Types.ObjectId | IUser; 
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
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

const Transaction =
  mongoose.models.Transaction ??
  mongoose.model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
