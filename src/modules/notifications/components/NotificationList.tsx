import React from 'react';
import { Notification } from '../types';
import { formatDate } from '@/modules/core/utils/format';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead 
}) => {
  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`p-4 rounded border ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
        >
          <h4 className="font-semibold">{notification.title}</h4>
          <p className="text-gray-600">{notification.message}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {formatDate(notification.createdAt)}
            </span>
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-sm text-primary"
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}; 