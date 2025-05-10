import { NextResponse } from 'next/server';
import NotificationSetting from '@/app/models/NotificationSetting';
import connect from '@/lib/db';
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/app/logto';

export async function GET() {
    try {
        await connect();

        const { claims } = await getLogtoContext(logtoConfig);

        if (!claims?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let settings = await NotificationSetting.findOne({
            user: claims?.sub,
        });

        if (!settings) {
            const newSettings = new NotificationSetting({
                user: claims?.sub,
                emailNotifications: false,
                pushNotifications: false,
                notificationTypes: {
                    'new-messages': false,
                    'mentions': false,
                    'updates': false,
                    'security-alerts': false
                },
            });
            await newSettings.save();
            settings = newSettings;
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }

}

export async function PATCH(request: Request) {
    try {
        const { claims } = await getLogtoContext(logtoConfig);
        if (!claims?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type, value } = await request.json();
        await connect();
        
        const settings = await NotificationSetting.findOneAndUpdate(
            { user: claims?.sub },
            {
                $set: {
                    [type]: value,
                },
            },
            { 
                upsert: true,
                new: true // Returns the modified document rather than the original
            }
        );

        return NextResponse.json(settings);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }

} 