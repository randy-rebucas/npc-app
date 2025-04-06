import connect from "@/lib/db";
import Notification from "@/app/models/Notification";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError } from '@/lib/errors';
import { z } from 'zod';

const NotificationSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    link: z.string().url().optional(),
});

export async function createNotification(data: z.infer<typeof NotificationSchema>) {
    const validated = NotificationSchema.parse(data);
    
    const [result, error] = await handleAsync(
        (async () => {
            await connect();
            return await Notification.create(validated);
        })()
    );

    if (error) {
        throw new DatabaseError(`Failed to create notification: ${error.message}`);
    }

    return result;
} 