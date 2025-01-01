'use client';

// import { INotification } from "@/app/models/Notification";
import Breadcrumbs from "./breadcrumbs";
import { SignOut } from "./signout";
import { Notifications } from "@/components/notifications";
import { useNotifications } from "@/providers/notifications-provider";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Header({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  const { notifications } = useNotifications();

  return (
    <header className="w-full top-0 z-50 bg-white/90 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-md">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Breadcrumbs breadcrumbs={breadcrumbs} />

          <div className="flex items-center gap-4">
            <Notifications count={notifications.length} notifications={notifications} />
            <SignOut />
          </div>
        </div>
      </nav>
    </header>
  );
}