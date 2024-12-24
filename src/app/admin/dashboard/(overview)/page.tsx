import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, RefreshCcw, Webhook, Shrub } from "lucide-react";
import { countMembers } from "@/app/actions/members";
import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Admin Dashboard',
 };

export default async function AdminDashboard() {

    const { totalCount: counts } = await MemberstackAdminService.listMembers();

    const totalMembers = await countMembers();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatsCard
                title="Total Members"
                value="3"
                description="0% vs last month"
                icon={Users}
            />
            <StatsCard
                title="Signups (last 30 days)"
                value="0"
                description="0% vs previous 30 days"
                icon={UserPlus}
            />
            <StatsCard
                title="Webhook Events"
                value={totalMembers.toString()}
                icon={Webhook}
            />
            <StatsCard
                title="Memstack Members"
                value={counts}
                icon={Shrub}
            />
            <StatsCard
                title="Synced Members"
                value="0"
                icon={RefreshCcw}
            />
        </div>
    );
}

interface StatsCardProps {
    title: string;
    value: string;
    description?: string;
    icon: React.ElementType;
}

function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}


