'use client';

import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { value: "application", label: "Application", href: "/admin/dashboard/settings/application" },
  { value: "profile", label: "Profile", href: "/admin/dashboard/settings/profile" },
  { value: "password", label: "Password", href: "/admin/dashboard/settings/password" },
  { value: "notification", label: "Notifications", href: "/admin/dashboard/settings/notification" }
];

type Breadcrumb = {
  label: string;
  href: string;
  active?: boolean;
};

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop();
  
  const currentTabData = settingsTabs.find(tab => tab.value === currentTab);
  const title = currentTabData?.label || 'Settings';

  const breadcrumbs: Breadcrumb[] = [
    { label: 'Admin', href: '/admin' },
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Settings', href: '/admin/dashboard/settings', active: currentTab === 'settings' },
    ...(currentTabData ? [{ label: currentTabData.label, href: currentTabData.href, active: true }] : [])
  ];

  return (
    <SidebarInset>
      <AdminHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">
              Manage your admin preferences and system settings
            </p>
          </div>
        </div>

        <Tabs defaultValue={currentTab} className="space-y-4">
          <TabsList>
            {settingsTabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn("w-[120px]")}
                asChild
              >
                <Link href={tab.href}>{tab.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {children}
      </div>
    </SidebarInset>
  );
}
