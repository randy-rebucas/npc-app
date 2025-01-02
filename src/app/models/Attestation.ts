import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IAttestation {
  _id: string; // Add this line
  user: Types.ObjectId | IUser; 
  schema: string;
  recipient: string;
  attester: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
}

const attestationSchema = new Schema<IAttestation>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  schema: { type: String, required: true },
  recipient: { type: String, required: true },
  attester: { type: String, required: true },
  timestamp: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Attestation =
  mongoose.models.Attestation ??
  mongoose.model<IAttestation>("Attestation", attestationSchema);

export default Attestation;
