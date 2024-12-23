import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, RefreshCcw, Webhook, Shrub } from "lucide-react";
import { countMembers } from "@/app/actions/members";
import { MemberstackAdminService } from "@/utils/memberstack-admin";
import { Chart } from "@/components/admin/Chart";
import { Event } from "@/components/admin/Event";

export default async function AdminDashboard() {

    const { totalCount: counts } = await MemberstackAdminService.listMembers();

    const totalMembers = await countMembers();

    

    return <SidebarInset>
        <AdminHeader breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Dashboard', href: '/admin/dashboard', active: true },
        ]} />

        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full">
                {/* Stats Grid */}
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

                {/* Activity Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Chart />

                    <Event />
                </div>

                {/* Members Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">New Members</CardTitle>
                        <a href="#" className="text-sm text-blue-600 hover:underline">View all</a>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead>Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>chris123@aol.com</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            Pending Collaborator
                                        </span>
                                    </TableCell>
                                    <TableCell>20 Sep, 2024</TableCell>
                                    <TableCell>Christopher Caulfield</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    </SidebarInset>;
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


