'use client';

import { INotification } from "@/app/models/Notification";
import Breadcrumbs from "./breadcrumbs";
import { SignOut } from "./signout";
import { Notifications } from "@/components/notifications";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Header({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  const notifications: INotification[] = [
    {
      _id: '1',
      userId: 'user123',
      title: 'New Message',
      message: 'You have received a new message from John Doe',
      read: false,
      link: '/messages/123',
      createdAt: new Date()
    },
    {
      _id: '2',
      userId: 'user123',
      title: 'Friend Request',
      message: 'Sarah Smith wants to connect with you',
      read: false,
      link: '/friends/requests',
      createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      _id: '3',
      userId: 'user123',
      title: 'Post Liked',
      message: 'Alex Johnson and 5 others liked your post "Getting Started with React"',
      read: true,
      link: '/posts/789',
      createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    },
    {
      _id: '4',
      userId: 'user123',
      title: 'Comment on Your Post',
      message: 'Michael Brown commented on your post: "Great article! Thanks for sharing."',
      read: false,
      link: '/posts/789#comments',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      _id: '5',
      userId: 'user123',
      title: 'Meeting Reminder',
      message: 'Team standup meeting starts in 15 minutes',
      read: false,
      link: '/calendar/meeting/456',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
    },
    {
      _id: '6',
      userId: 'user123',
      title: 'System Update',
      message: 'New features have been added to the platform. Click to learn more.',
      read: true,
      link: '/updates/latest',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      _id: '7',
      userId: 'user123',
      title: 'Achievement Unlocked',
      message: "Congratulations! You've completed 10 tasks this week.",
      read: false,
      link: '/achievements',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
    },
    {
      _id: '8',
      userId: 'user123',
      title: 'Security Alert',
      message: 'New login detected from an unknown device. Please verify if this was you.',
      read: false,
      link: '/security/alerts',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) // 3 days ago
    },
    {
      _id: '9',
      userId: 'user123',
      title: 'Subscription Renewal',
      message: 'Your premium subscription will renew in 3 days',
      read: true,
      link: '/subscription',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96) // 4 days ago
    },
    {
      _id: '10',
      userId: 'user123',
      title: 'Content Update',
      message: 'New resources have been added to your learning path',
      read: true,
      link: '/learning/path',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120) // 5 days ago
    }
  ];

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