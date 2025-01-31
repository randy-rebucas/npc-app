import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import NotificationSetting from '@/app/models/NotificationSetting';
import connect from '@/lib/db';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET() {
    try {
        await connect();

        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let settings = await NotificationSetting.findOne({
            user: session.user.id,
        });

        if (!settings) {
            const newSettings = new NotificationSetting({
                user: session.user.id,
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
        console.log(settings);

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
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { type, value } = await request.json();
        await connect();
        
        const settings = await NotificationSetting.findOneAndUpdate(
            { user: session.user.id },
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