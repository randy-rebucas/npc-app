import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { MemberstackAdminService } from '@/utils/memberstack-admin';
import { countMembers } from '@/app/actions/members';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Admin Members',
};

export default async function AdminMembersPage() {

    const { totalCount: counts } = await MemberstackAdminService.listMembers();

    const totalMembers = await countMembers();

    return (
        <div className="gap-4 grid grid-cols-2">
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
    );
}