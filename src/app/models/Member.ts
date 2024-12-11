import mongoose, { Schema } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IMember {
  _id: string;
  event: string;
  payload: object;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Create an Schema corresponding to the document interface.
const memberSchema = new Schema<IMember>({
  _id: String,
  event: String,
  payload: Object,
  createdAt: Date,
  updatedAt: Date,
});

// 3. Create a Model.
const Member =
  mongoose.models.Members ??
  mongoose.model<IMember>("Members", memberSchema);

export default Member;


