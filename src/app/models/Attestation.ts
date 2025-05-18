import mongoose, { Document, Schema } from 'mongoose';

export interface IAttestation extends Document {
  userId: string;
  type: 'physician' | 'nurse';
  attestedItems: {
    item: string;
    attestedAt: Date;
  }[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
// schema: { type: String, required: true },
// recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
// attester: { type: Schema.Types.ObjectId, ref: "User", required: true },
// timestamp: { type: Date, required: true },
// status: { type: String, enum: AttestationStatus, required: true },
// createdAt: { type: Date, default: Date.now },
const AttestationSchema = new Schema<IAttestation>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['physician', 'nurse'],
      required: [true, 'Attestation type is required'],
    },
    attestedItems: [{
      item: {
        type: String,
        required: [true, 'Attestation item is required'],
      },
      attestedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Attestation ?? mongoose.model<IAttestation>('Attestation', AttestationSchema);