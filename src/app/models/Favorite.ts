import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IFavorite {
  id: string;
  npUser: Types.ObjectId | IUser;
  physicianUser: Types.ObjectId | IUser;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    npUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    physicianUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ npUser: 1 });
favoriteSchema.index({ physicianUser: 1 });
favoriteSchema.index({ npUser: 1, physicianUser: 1 }, { unique: true });

const Favorite =
  mongoose.models.Favorite ??
  mongoose.model<IFavorite>("Favorite", favoriteSchema);

export default Favorite;
