import connect from "@/lib/db";
import Notification from "@/app/models/Notification";


export async function createNotification({
  userId,
  title,
  message,
  link,
}: {
  userId: string;
  title: string;
  message: string;
  link?: string;
}) {
  try {
    await connect();
    
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      link,
    });

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
} 