import mongoose, { Schema } from "mongoose";

export interface IMedicalLicenseState {
  id: string;
  state: string;
}

const medicalLicenseStateSchema = new Schema<IMedicalLicenseState>(
  {
    state: { type: String, required: true },
  },
  { timestamps: true }
);

const MedicalLicenseState =
  mongoose.models.MedicalLicenseStates ??
  mongoose.model<IMedicalLicenseState>("MedicalLicenseStates", medicalLicenseStateSchema);

export default MedicalLicenseState;