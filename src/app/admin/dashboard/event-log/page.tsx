import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import { getEvents } from "@/app/actions/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { LogIn, UserCog, UserPlus, UserMinus, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

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
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Event Log</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Input 
                            placeholder="Search events..." 
                            className="max-w-sm"
                        />
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Event Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                <SelectItem value="logged-in">Logged In</SelectItem>
                                <SelectItem value="member-updated">Member Updated</SelectItem>
                                <SelectItem value="member-created">Member Created</SelectItem>
                                <SelectItem value="member-deleted">Member Deleted</SelectItem>
                                <SelectItem value="member-synced">Member Synced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => {
                                    const Icon = getEventIcon(event.type);
                                    return (
                                        <TableRow key={event._id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="rounded-full p-2 bg-gray-100">
                                                        <Icon className="h-4 w-4 text-gray-600" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{event.email}</TableCell>
                                            <TableCell>{event.type}</TableCell>
                                            <TableCell>{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {page * ITEMS_PER_PAGE} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}