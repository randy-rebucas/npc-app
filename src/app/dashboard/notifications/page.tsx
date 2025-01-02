"use client"

import { INotification } from "@/app/models/Notification";
import Header from "@/components/header";
import { useNotifications } from "@/providers/notifications-provider";
import { useState } from "react";

export default function NotificationsPage() {

    const { notifications, markAsRead, markAllAsRead } = useNotifications();

    const breadcrumbs = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notifications", href: "/dashboard/notifications", active: true },
    ];

    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={breadcrumbs} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col bg-white rounded-lg shadow">
                    {/* Header Section */}
                    <div className="p-4 border-b flex justify-between items-center">
                        <h1 className="text-xl font-semibold">Notifications</h1>
                        <button
                            onClick={markAllAsRead}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            disabled={selectedNotifications.length === 0}
                        >
                            Mark Selected as Read
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="divide-y divide-gray-200">
                        {notifications.map((notification: INotification) => (
                            <div
                                key={notification._id}
                                onClick={() => markAsRead(notification._id)}
                                className={`p-4 flex items-start hover:bg-gray-50 ${notification.read ? 'bg-gray-50' : ''
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 mt-1 text-blue-600 rounded"
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
                                    <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-900'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button
                                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-700">
                                Page {currentPage}
                            </span>
                            <button
                                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
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
