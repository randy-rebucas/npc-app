import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./User";

export interface IMessage {
  sender: Types.ObjectId | IUser;
  content: string;
  timestamp: Date;
  isAgent: boolean;
  isRead: boolean;
}

export interface IChat extends Document {
  _id: string;
  customerId: Types.ObjectId | IUser;
  agentId: Types.ObjectId | IUser;
  content: string;
  createdAt: Date;
}

const chatSchema = new Schema({
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  agentId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Chat = mongoose.models.Chat ?? mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
