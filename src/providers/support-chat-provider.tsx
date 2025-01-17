'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

interface SupportChatContextType {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  toggleChat: () => void;
  closeChat: () => void;
  openChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: () => void;
  unreadCount: number;
}

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined);

export function SupportChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement API call to fetch messages
        // const response = await fetch('/api/support-messages');
        // const data = await response.json();
        // setMessages(data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  // Listen for new messages
  useEffect(() => {
    // TODO: Implement websocket connection or polling
    // const socket = new WebSocket('ws://your-websocket-url');
    // socket.onmessage = (event) => {
    //   const newMessage = JSON.parse(event.data);
    //   setMessages(prev => [...prev, newMessage]);
    //   if (!isOpen) setUnreadCount(prev => prev + 1);
    // };
    // return () => socket.close();
  }, [isOpen]);

  const toggleChat = () => setIsOpen(prev => !prev);
  const closeChat = () => setIsOpen(false);
  const openChat = () => {
    setIsOpen(true);
    markAsRead();
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
      };

      // TODO: Implement API call to send message
      // await fetch('/api/support-messages', {
      //   method: 'POST',
      //   body: JSON.stringify({ content }),
      // });

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SupportChatContext.Provider 
      value={{ 
        isOpen, 
        messages, 
        isLoading, 
        toggleChat, 
        closeChat, 
        openChat, 
        sendMessage,
        markAsRead,
        unreadCount,
      }}
    >
      {children}
    </SupportChatContext.Provider>
  );
}

export function useSupportChat() {
  const context = useContext(SupportChatContext);
  if (context === undefined) {
    throw new Error('useSupportChat must be used within a SupportChatProvider');
  }
  return context;
}