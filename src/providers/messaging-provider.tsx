'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import { IMessage } from '@/app/models/Message';
import { useSession } from "@/providers/logto-session-provider";

interface MessagingContextType {
  messages: IMessage[];
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  getSenderName: (senderId: string) => Promise<string>;
  unreadCount: number;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const { claims } = useSession();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
      setUnreadCount(data.filter((m: IMessage) =>
        m.receiverId.toString() === claims?.sub && !m.read
      ).length);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [claims?.sub]);

  useEffect(() => {
    if (claims?.sub) {
      fetchMessages();
      const channel = pusherClient.subscribe(`user-${claims?.sub}`);

      channel.bind('new-message', (message: IMessage) => {
        setMessages(prev => [...prev, message]);
        if (message.receiverId.toString() === claims?.sub && !message.read) {
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => {
        channel.unbind_all();
        pusherClient.unsubscribe(`user-${claims?.sub}`);
      };
    }
  }, [claims?.sub, fetchMessages]); 

  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, content }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const data = await response.json();
      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, []);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
      setMessages(prev =>
        prev.map(m => m._id === messageId ? { ...m, read: true } as IMessage : m)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }, []);

  const getSenderName = useCallback(async (senderId: string) => { 
    try { 
      const response = await fetch(`/api/user/${senderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sender name');
      }
      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error('Error getting sender name:', error);
      return 'Unknown';
    }
  }, []);

  return (
    <MessagingContext.Provider value={{ 
      messages, 
      sendMessage, 
      markAsRead, 
      getSenderName, 
      unreadCount 
    }}>
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
