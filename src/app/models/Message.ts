import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  timestamp: Date;
  read: boolean;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
}

const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Message =
  mongoose.models.Message ??
  mongoose.model<IMessage>("Message", messageSchema);

export default Message;