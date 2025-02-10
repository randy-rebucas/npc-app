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

export default function SettingsLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();
  const currentTab = pathname.split('/').pop();

  const isApplication = pathname.split('/').pop() === 'application';
  const isProfile = pathname.split('/').pop() === 'profile';
  const isPassword = pathname.split('/').pop() === 'password';
  const isNotification = pathname.split('/').pop() === 'notification';


  const title = isApplication ? 'Application' : isProfile ? 'Profile' : isPassword ? 'Password' : isNotification ? 'Notification' : 'Settings';


  const breadcrumbs: Breadcrumb[] = [
    { label: 'Admin', href: '/admin' },
    { label: 'Settings', href: '/admin/settings', active: true },
  ];


  if (isApplication) {
    breadcrumbs.push({
      label: 'Application',

      href: '/admin/dashboard/settings/application',
      active: isApplication,
    });
  }


  if (isProfile) {
    breadcrumbs.push({
      label: 'Profile',

      href: '/admin/dashboard/settings/profile',
      active: isProfile,

    });
  }

  if (isPassword) {
    breadcrumbs.push({
      label: 'Password',

      href: '/admin/dashboard/settings/password',
      active: isPassword,
    });
  }

  if (isNotification) {
    breadcrumbs.push({
      label: 'Notification',

      href: '/admin/dashboard/settings/notification',
      active: isNotification,
    });
  }

  return (
    <SidebarInset>

      <AdminHeader
        breadcrumbs={breadcrumbs}
      />
      <div className="flex flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">
              Manage your settings
            </p>
          </div>
        </div>

        <Tabs defaultValue={currentTab} className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="application"
              className={cn("w-[120px]")}
              asChild
            >
              <Link href="/admin/dashboard/settings/application">Application</Link>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className={cn("w-[120px]")}
              asChild
            >
              <Link href="/admin/dashboard/settings/profile">Profile</Link>
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className={cn("w-[120px]")}
              asChild
            >
              <Link href="/admin/dashboard/settings/password">Password</Link>
            </TabsTrigger>
            <TabsTrigger
              value="notification"
              className={cn("w-[120px]")}
              asChild
            >
              <Link href="/admin/dashboard/settings/notification">Notifications</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {children}

      </div>
    </SidebarInset >
  );
}
