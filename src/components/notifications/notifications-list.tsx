"use client";

import { useNotifications } from "@/providers/notifications-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export function NotificationsList() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>
      <ScrollArea className="h-[300px]">
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground">No notifications</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg ${
                  notification.read ? 'bg-muted/50' : 'bg-muted'
                }`}
              >
                {notification.link ? (
                  <Link href={notification.link} onClick={() => markAsRead(notification._id)}>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </Link>
                ) : (
                  <div onClick={() => markAsRead(notification._id)}>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
} 