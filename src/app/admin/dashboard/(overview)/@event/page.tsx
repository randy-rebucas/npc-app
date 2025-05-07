import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminEventPage() {

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Event Log</CardTitle>
                <Link href="/admin/dashboard/events" className="text-sm text-blue-600 hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
                under construction 
            </CardContent>
        </Card>
    );
}
