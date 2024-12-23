import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Calendar, DollarSign, LogIn, UserCog } from "lucide-react";

export default function AdminDashboard() {
    return <SidebarInset>
        <AdminHeader breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Dashboard', href: '/admin/dashboard', active: true },
        ]} />
        
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                        title="One-time plans"
                        value="0"
                        icon={Calendar}
                    />
                    <StatsCard
                        title="Paid Members"
                        value="0"
                        icon={DollarSign}
                    />
                </div>

                {/* Activity Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base font-medium">Signups</CardTitle>
                                <Select defaultValue="7days">
                                    <SelectTrigger className="w-[140px] h-8">
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7days">Last 7 days</SelectItem>
                                        <SelectItem value="30days">Last 30 days</SelectItem>
                                        <SelectItem value="90days">Last 90 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Select defaultValue="daily">
                                <SelectTrigger className="w-[100px] h-8">
                                    <SelectValue placeholder="Select view" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            {/* Add your chart component here */}
                            <div className="h-[200px]" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">Event Log</CardTitle>
                            <a href="#" className="text-sm text-blue-600 hover:underline">View all</a>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <EventLogItem
                                    email="chriscaulfieldrn@gmail.com"
                                    type="logged-in"
                                    icon={LogIn}
                                />
                                <EventLogItem
                                    email="caulfield4000@icloud.com"
                                    type="member-updated"
                                    icon={UserCog}
                                />
                            </div>
                        </CardContent>
                    </Card>
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

interface EventLogItemProps {
    email: string;
    type: 'logged-in' | 'member-updated';
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