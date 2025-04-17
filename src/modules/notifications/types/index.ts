export interface Notification {
  id: string;
  userId: string;
  type: 'alert' | 'message' | 'update';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  sms: boolean;
} 