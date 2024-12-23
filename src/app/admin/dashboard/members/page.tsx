import { Metadata } from 'next';
import { SidebarInset } from '@/components/ui/sidebar';
import AdminHeader from "@/components/admin/Header";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { MemberstackAdminService } from '@/utils/memberstack-admin';
import { countMembers } from '@/app/actions/members';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Members',
};

export default async function AdminMembersPage() {
    
    const { totalCount: counts } = await MemberstackAdminService.listMembers();

    const totalMembers = await countMembers();

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                {
                    label: 'Members',
                    href: '/admin/members',
                    active: true,
                },
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Members</h1>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Webhook Members
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs" asChild>
                                    <Link href="/admin/dashboard/members/webhook">View all</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalMembers}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total webhook members
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Node API Members
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs" asChild>
                                    <Link href="/admin/dashboard/members/node-api">View all</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{counts}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total node API members
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SidebarInset>

    );
}