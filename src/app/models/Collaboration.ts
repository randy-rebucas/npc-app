import mongoose from "mongoose";

const collaborationRequestSchema = new mongoose.Schema({
  npUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  physicianUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
  npUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  physicianUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
  mongoose.model("CollaborationRequest", collaborationRequestSchema);

export const ActiveCollaboration =
  mongoose.models.ActiveCollaboration ||
  mongoose.model("ActiveCollaboration", activeCollaborationSchema);
