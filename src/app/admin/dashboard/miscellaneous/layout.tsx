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

export default function MiscellaneousLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();
  
    const isMiscellaneous = pathname.split('/').pop() === 'miscellaneous';
    const isLicenseStates = pathname.split('/').pop() === 'license-states';
    const isPracticeTypes = pathname.split('/').pop() === 'practice-types';

    const title = isMiscellaneous ? 'Miscellaneous' : isLicenseStates ? 'Medical License States' : isPracticeTypes ? 'Practice Types' : 'Miscellaneous';

    const breadcrumbs: Breadcrumb[] = [
        { label: 'Admin', href: '/admin' },
        { label: 'Miscellaneous', href: '/admin/dashboard/miscellaneous', active: isMiscellaneous },
    ];

    if (isLicenseStates) {
        breadcrumbs.push({
            label: 'Medical License States',
            href: '/admin/dashboard/miscellaneous/license-states',
            active: isLicenseStates,
        });
    }

    if (isPracticeTypes) {
        breadcrumbs.push({
            label: 'Practice Types',
            href: '/admin/dashboard/miscellaneous/practice-types',
            active: isPracticeTypes,
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
                            Manage your miscellaneous settings
                        </p>
                    </div>
                </div>

                <Tabs defaultValue={currentTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger
                            value="miscellaneous"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/miscellaneous">Overview</Link>
                        </TabsTrigger>
                        <TabsTrigger
                            value="license-states"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/miscellaneous/license-states">License States</Link>
                        </TabsTrigger>
                        <TabsTrigger
                            value="practice-types"
                            className={cn("w-[120px]")}
                            asChild
                        >
                            <Link href="/admin/dashboard/miscellaneous/practice-types">Practice Types</Link>
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