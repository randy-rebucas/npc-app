import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface ITransaction {
  _id: string;
  user: Types.ObjectId | IUser; 
  amount: number;
  createdAt: Date;
  stripeTransactionId: string;
  currency: string;
  status: string;
}

const transactionSchema = new Schema<ITransaction>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: {
    type: Number,
    required: true,
  },
  stripeTransactionId: { type: String, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
}, { timestamps: true });

const Transaction =
  mongoose.models.Transaction ??
  mongoose.model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
