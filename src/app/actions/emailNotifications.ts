import { revalidateTag } from "next/cache";
import connect from "@/lib/db";
import EmailNotification from "@/app/models/EmailNotification";

interface GetNotificationsParams {
  page: number;
  search?: string;
  limit?: number;
}

interface NotificationQuery {
  $or?: {
    title?: { $regex: string; $options: string } | string;
  }[];
}

export interface EmailNotificationDocument {
  _id: string; // We'll cast this to string anyway
  title: string;
  message: string;
  link: string;
}

interface GetNotificationsResponse {
  notifications: EmailNotificationDocument[];
  total: number;
}

export async function getNotifications({
  page = 1,
  search = "",
  limit = 10,
}: GetNotificationsParams): Promise<GetNotificationsResponse> {
  try {
    await connect();
    // Build query conditions
    const query: NotificationQuery = {};

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      EmailNotification.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      EmailNotification.countDocuments(query),
    ]);

    return {
      notifications: (notifications as unknown as EmailNotificationDocument[]).map(
        (notification) => ({
          _id: notification._id.toString(),
          title: notification.title,
          message: notification.message,
          link: notification.link,
        })
      ),
      total,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

export async function deleteNotification(id: string) {
  try {
    await connect();
    await EmailNotification.findByIdAndDelete(id);
    revalidateTag("email-notifications"); // Update cached notifications
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete notification" };
  }
}
