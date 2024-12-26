import mongoose from "mongoose";

export interface IRequestedFeature {
  email: string;
  title: string;
  description: string;
  createdAt: Date;
}

const requestedFeatureSchema = new mongoose.Schema<IRequestedFeature>({
  email: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const RequestedFeature =
  mongoose.models.RequestedFeature ??
  mongoose.model<IRequestedFeature>("RequestedFeature", requestedFeatureSchema);

export default RequestedFeature;
