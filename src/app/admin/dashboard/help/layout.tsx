'use client';

import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
// ... existing code ...
type Breadcrumb = {
    label: string;
    href: string;
    active?: boolean;  // Add optional active property
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();
    console.log(currentTab);
    const isFeatures = pathname.split('/').pop() === 'features';
    const isEnquiries = pathname.split('/').pop() === 'enquiries';
    const isIssues = pathname.split('/').pop() === 'issues';

    const title = isFeatures ? 'Features' : isEnquiries ? 'Enquiries' : isIssues ? 'Issues' : 'Webhook';

    const breadcrumbs: Breadcrumb[] = [
        { label: 'Admin', href: '/admin' },
        { label: 'Help', href: '/admin/dashboard/help' },
    ];

    if (isFeatures) {
        breadcrumbs.push({
            label: 'Features',
            href: '/admin/dashboard/help/features',
            active: isFeatures,
        });
    }

    if (isIssues) {
        breadcrumbs.push({
            label: 'Issues',
            href: '/admin/dashboard/help/issues',
            active: isIssues,
        });
    }

    if (isEnquiries) {
        breadcrumbs.push({
            label: 'Enquiries',
            href: '/admin/dashboard/help/enquiries',
            active: isEnquiries,
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
                            value="help"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/help">Overview</Link>
                        </TabsTrigger>
                        <TabsTrigger
                            value="features"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/help/features">Features</Link>
                        </TabsTrigger>
                        <TabsTrigger
                            value="webhook"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/help/issues">Issues</Link>
                        </TabsTrigger>
                        <TabsTrigger
                            value="enquiries"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/help/enquiries">Enquiries</Link>
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