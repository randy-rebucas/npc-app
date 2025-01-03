import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  name: string;
  participants: mongoose.Types.ObjectId[];
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

const chatSchema = new Schema({
  name: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  lastMessage: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
  unread: { type: Boolean, default: false },
});

const Chat = mongoose.models.Chat ?? mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
