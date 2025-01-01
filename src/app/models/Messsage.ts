import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IMessage {
  _id: string; // Add this line
  content: string;
  sender: string;
  user: Types.ObjectId | IUser;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  sender: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message =
  mongoose.models.Message ?? mongoose.model<IMessage>("Message", messageSchema);

export default Message;
