import mongoose from "mongoose";

export interface IEvent {
  user: string;
  email: string;
  type: 'logged-in' | 'member-updated' | 'member-created' | 'member-deleted' | 'member-synced';
  createdAt: Date;
}

const eventSchema = new mongoose.Schema<IEvent>({
  user: { type: String, required: true },
  email: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['logged-in', 'member-updated', 'member-created', 'member-deleted', 'member-synced']
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema); 