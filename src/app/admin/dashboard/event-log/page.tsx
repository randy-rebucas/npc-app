import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import { getEvents } from "@/app/actions/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { LogIn, UserCog, UserPlus, UserMinus, RefreshCcw } from "lucide-react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function EventLog(props: {
    searchParams: SearchParams
}) {
    const ITEMS_PER_PAGE = 10;

    const searchParams = await props.searchParams
    const page = Number(searchParams?.page) || 1;
    const { events } = await getEvents({ page, limit: ITEMS_PER_PAGE });

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

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Event Log', href: '/admin/dashboard/event-log', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Event Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {events.map((event) => {
                                const Icon = getEventIcon(event.type);
                                return (
                                    <div key={event._id} className="flex items-center gap-4">
                                        <div className="rounded-full p-2 bg-gray-100">
                                            <Icon className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{event.email}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {event.type} • {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
    );
}