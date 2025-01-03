import mongoose, { Schema, Document } from "mongoose";

export interface ISharedFile extends Document {
  chatId: mongoose.Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

const sharedFileSchema = new Schema({
  chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  uploadedAt: { type: Date, default: Date.now },
});


const SharedFile =
  mongoose.models.SharedFile ??
  mongoose.model<ISharedFile>("SharedFile", sharedFileSchema);

export default SharedFile;
