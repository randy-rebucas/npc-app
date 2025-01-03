import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  content: string; 
  sender: mongoose.Types.ObjectId;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({ 
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  content: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message =
  mongoose.models.Message ??
  mongoose.model<IMessage>("Message", messageSchema);

export default Message;