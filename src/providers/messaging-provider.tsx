'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import { IMessage } from '@/app/models/Message';
import { useSession } from 'next-auth/react';

interface MessagingContextType {
  messages: IMessage[];
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  unreadCount: number;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        setMessages(data);
        setUnreadCount(data.filter((m: IMessage) =>
          m.receiverId.toString() === session?.user?.id && !m.read
        ).length);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (session?.user?.id) {
      fetchMessages();
      const channel = pusherClient.subscribe(`user-${session.user.id}`);

      channel.bind('new-message', (message: IMessage) => {
        setMessages(prev => [...prev, message]);
        if (message.receiverId.toString() === session.user.id && !message.read) {
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => {
        pusherClient.unsubscribe(`user-${session.user.id}`);
      };
    }
  }, [session]);

  const sendMessage = async (receiverId: string, content: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, content }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
      });
      setMessages(prev =>
        prev.map(m => m._id === messageId ? { ...m, read: true } as IMessage : m)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <MessagingContext.Provider value={{ messages, sendMessage, markAsRead, unreadCount }}>
      {children}
    </MessagingContext.Provider>
  );
}

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
