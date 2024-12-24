import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, RefreshCcw, UserCog, UserPlus, UserMinus } from "lucide-react";
import { getEvents } from "@/app/actions/events";

export default async function AdminEventPage() {
    const getEventIcon = (type: string) => {
        switch (type) {
            case 'logged-in':
                return LogIn;
            case 'member-updated':
                return UserCog;
            case 'member-created':
                return UserPlus;
            case 'member-deleted':
                return UserMinus;
            case 'member-synced':
                return RefreshCcw;
            default:
                return LogIn;
        }
    };

    const { events } = await getEvents({ page: 1, limit: 6 });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Event Log</CardTitle>
                <a href="/admin/dashboard/events" className="text-sm text-blue-600 hover:underline">View all</a>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.map((event) => {
                        const Icon = getEventIcon(event.type);
                        return (
                            <EventLogItem
                                key={event.id}
                                email={event.email}
                                type={event.type}
                                icon={Icon}
                            />
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

interface EventLogItemProps {
    email: string;
    type: string;
    icon: React.ElementType;
}

function EventLogItem({ email, type, icon: Icon }: EventLogItemProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="rounded-full p-2 bg-gray-100">
                <Icon className="h-4 w-4 text-gray-600" />
            </div>
            <div>
                <p className="text-sm font-medium">{email}</p>
                <p className="text-xs text-muted-foreground">
                    {type === 'logged-in' ? 'Logged in' : 'Member Updated'}
                </p>
            </div>
        </div>
    );
}