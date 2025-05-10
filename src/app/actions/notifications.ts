import connect from "@/lib/db";
import Notification from "@/app/models/Notification";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError } from '@/lib/errors';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const NotificationSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    link: z.string().url().optional(),
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

export async function createNotification(data: z.infer<typeof NotificationSchema>) {
    // Add rate limiting check
    if (await limiter.tryRemaining(data.userId) === 0) {
        throw new Error('Too many notifications created. Please try again later.');
    }

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