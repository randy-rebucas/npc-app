'use client';

import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function AdminMembersLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();
    
    const isNodeApi = pathname.split('/').pop() === 'node-api';
    const isWebhook = pathname.split('/').pop() === 'webhook';
    const isMembers = pathname.split('/').pop() === 'members';

    const title = isMembers ? 'Members' : isNodeApi ? 'Node API' : 'Webhook';

    const breadcrumbs = [
        { label: 'Admin', href: '/admin' },
        {
            label: 'Members',
            href: '/admin/dashboard/members',
            active: isMembers,
        },
    ];

    if (isNodeApi) {
        breadcrumbs.push({
            label: 'Node API',
            href: '/admin/dashboard/members/node-api',
            active: isNodeApi,
        });
    }

    if (isWebhook) {
        breadcrumbs.push({
            label: 'Webhook',
            href: '/admin/dashboard/members/webhook',
            active: isWebhook,
        });
    }

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={breadcrumbs} />
            
            <div className="flex flex-1 flex-col space-y-8 p-8">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                        <p className="text-muted-foreground">
                            Manage your member settings and preferences
                        </p>
                    </div>
                </div>

                <Tabs defaultValue={currentTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger
                            value="members"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/members">Overview</Link>
                        </TabsTrigger>
                        <TabsTrigger
                            value="node-api"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/members/node-api">Node API</Link>
                        </TabsTrigger>
                        <TabsTrigger
                            value="webhook"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/members/webhook">Webhook</Link>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="border rounded-lg p-4">
                    {children}
                </div>
            </div>
        </SidebarInset>
    );
}