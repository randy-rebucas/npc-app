import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IAttestation {
  _id: string; // Add this line
  schema: string;
  recipient: Types.ObjectId | IUser; 
  attester: Types.ObjectId | IUser; 
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
}

const attestationSchema = new Schema<IAttestation>({
  schema: { type: String, required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  attester: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: String, required: true },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Attestation =
  mongoose.models.Attestation ??
  mongoose.model<IAttestation>("Attestation", attestationSchema);

export default Attestation;
