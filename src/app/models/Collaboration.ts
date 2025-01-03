import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IActiveCollaboration {
  _id: string;
  npUser: Types.ObjectId | IUser;
  physicianUser: Types.ObjectId | IUser;
  startDate: Date;
  status: "active" | "paused" | "terminated";
  agreementSignedAt: Date;
  lastAttestationDate: Date;
  nextAttestationDue: Date;
  monthlyRate: number;
}

export interface ICollaborationRequest {
  _id: string;
  npUser: Types.ObjectId | IUser;
  physicianUser: Types.ObjectId | IUser;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  requestedAt: Date;
  message: string;
  responseMessage: string;
  respondedAt: Date;
}

const collaborationRequestSchema = new mongoose.Schema({
  npUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  physicianUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled"],
    default: "pending",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  message: String,
  responseMessage: String,
  respondedAt: Date,
});

const activeCollaborationSchema = new mongoose.Schema({
  npUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  physicianUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "paused", "terminated"],
    default: "active",
  },
  agreementSignedAt: Date,
  lastAttestationDate: Date,
  nextAttestationDue: Date,
});

export const CollaborationRequest =
  mongoose.models.CollaborationRequest ||
  mongoose.model<ICollaborationRequest>(
    "CollaborationRequest",
    collaborationRequestSchema
  );

export const ActiveCollaboration =
  mongoose.models.ActiveCollaboration ||
  mongoose.model<IActiveCollaboration>(
    "ActiveCollaboration",
    activeCollaborationSchema
  );
