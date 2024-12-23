import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface ICalendarAccessToken {
  id: string;
  access_token: string;
  user: Types.ObjectId | IUser;
}

const calendarAccessTokenSchema = new Schema<ICalendarAccessToken>(
  {
    access_token: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const CalendarAccessToken =
  mongoose.models.CalendarAccessToken ??
  mongoose.model<ICalendarAccessToken>(
    "CalendarAccessToken",
    calendarAccessTokenSchema
  );

export default CalendarAccessToken;
