import mongoose, { Schema } from "mongoose";

export interface INotificationSetting {
  _id: string; // Add this line
  user: string; 
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationTypes: {
    [key: string]: boolean;
  };

  createdAt: Date;
}

const notificationSettingSchema = new Schema<INotificationSetting>({
  user: { type: String, required: true },
  emailNotifications: { type: Boolean, default: false },
  pushNotifications: { type: Boolean, default: false },
  notificationTypes: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },

});

const NotificationSetting =
  mongoose.models.NotificationSetting ??
  mongoose.model<INotificationSetting>("NotificationSetting", notificationSettingSchema);


export default NotificationSetting;
