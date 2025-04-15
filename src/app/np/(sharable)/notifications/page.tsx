"use client"

import { INotification } from "@/app/models/Notification";
import Header from "@/components/header";
import { useNotifications } from "@/providers/notifications-provider";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

// Create a separate component for the notifications content
function NotificationsContent() {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="bg-background min-h-screen w-full">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col bg-card rounded-lg border shadow-sm">
                    {/* Header Section */}
                    <div className="p-4 border-b border-border flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
                        <button
                            onClick={markAllAsRead}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md 
                                     hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            disabled={selectedNotifications.length === 0}
                        >
                            Mark Selected as Read
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="divide-y divide-border">
                        {notifications.map((notification: INotification) => (
                            <div
                                key={notification._id}
                                onClick={() => markAsRead(notification._id)}
                                className={cn(
                                    "p-4 flex items-start hover:bg-muted/50 transition-colors",
                                    notification.read && "bg-muted"
                                )}
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 mt-1 text-primary border-border rounded 
                                             focus:ring-primary"
                                    checked={selectedNotifications.includes(notification._id)}
                                    onChange={() => {
                                        setSelectedNotifications(prev =>
                                            prev.includes(notification._id)
                                                ? prev.filter(id => id !== notification._id)
                                                : [...prev, notification._id]
                                        );
                                    }}
                                />
                                <div className="ml-3 flex-1">
                                    <p className={cn(
                                        "text-sm",
                                        notification.read ? "text-muted-foreground" : "text-foreground"
                                    )}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(notification.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-border flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button
                                className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80 
                                         text-muted-foreground transition-colors"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage}
                            </span>
                            <button
                                className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80 
                                         text-muted-foreground transition-colors"
                                onClick={() => setCurrentPage(p => p + 1)}
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Main page component with Suspense wrapper
export default function NotificationsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotificationsContent />
        </Suspense>
    );
}
