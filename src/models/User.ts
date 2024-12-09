import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Optional because of OAuth
  },
  name: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: true,
    default: 'credentials',
  },
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema); 