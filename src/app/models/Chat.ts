import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  isAgent: boolean;
  isRead: boolean;
}

export interface IChat extends Document {
  customerId: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  messages: IMessage[];
  status: 'active' | 'resolved' | 'waiting';
  lastActivity: Date;
  isAgentTyping: boolean;
  isCustomerTyping: boolean;
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
  messages: [{
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isAgent: { type: Boolean, required: true },
    isRead: { type: Boolean, default: false }
  }],
  status: {
    type: String,
    enum: ['active', 'resolved', 'waiting'],
    default: 'active'
  },
  lastActivity: { 
    type: Date, 
    default: Date.now 
  },
  isAgentTyping: { 
    type: Boolean, 
    default: false 
  },
  isCustomerTyping: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update lastActivity on new messages
chatSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

const Chat = mongoose.models.Chat ?? mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
