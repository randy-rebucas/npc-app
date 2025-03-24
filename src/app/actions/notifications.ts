import connect from "@/lib/db";
import Notification from "@/app/models/Notification";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, ValidationError } from '@/lib/errors';

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
  if (!userId || !title || !message) {
    throw new ValidationError('User ID, title, and message are required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      return await Notification.create({
        user: userId,
        title,
        message,
        link,
      });
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to create notification: ${error.message}`);
  }

  return result;
} 