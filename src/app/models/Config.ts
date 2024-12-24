import mongoose from "mongoose";

export interface IConfig {
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  siteFavicon: string;
  siteUrl: string;
  maintenanceMode: boolean;
}

const configSchema = new mongoose.Schema<IConfig>({
  siteName: { type: String, required: true },
  siteDescription: { type: String },
  siteLogo: { type: String },
  siteFavicon: { type: String },
  siteUrl: { type: String, required: true },
  maintenanceMode: { type: Boolean, required: true },
});

export default mongoose.models.Config || mongoose.model<IConfig>("Config", configSchema); 