import mongoose, { Schema } from "mongoose";

export interface IPracticeType {
  id: string;
  type: string;
}

const practiceTypeSchema = new Schema<IPracticeType>(
  {
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const PracticeType =
  mongoose.models.PracticeTypes ??
  mongoose.model<IPracticeType>("PracticeTypes", practiceTypeSchema);

export default PracticeType;