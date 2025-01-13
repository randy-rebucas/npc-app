'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
// import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
  isAgent: boolean;
  isRead: boolean;
}

interface Chat {
  _id: string;
  customerId: string;
  agentId: string;
  messages: Message[];
  status: 'active' | 'resolved' | 'waiting';
  isAgentTyping: boolean;
  isCustomerTyping: boolean;
}

export function Chat() {
  const { data: session } = useSession(); 
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load or create chat session
  useEffect(() => {
    const loadChat = async () => {
      try {
        const response = await fetch(`/api/chat/session?chatId=${session?.user.id}`);
        const data = await response.json();
        setChat(data.chat);
      } catch (err) {
        console.error('Failed to load chat:', err);
      }
    };

    if (isOpen && session?.user.id) {
      loadChat();
    }
  }, [isOpen, session]);

  // Updated typing indicator logic
  useEffect(() => {
    const updateTypingStatus = async (isTyping: boolean) => {
      if (!chat?._id) return;
      try {
        await fetch('/api/chat/typing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chatId: chat._id,
            isCustomerTyping: isTyping 
          }),
        });
      } catch (err) {
        console.error('Failed to update typing status:', err);
      }
    };

    if (newMessage && !isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    }

    const typingTimeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        updateTypingStatus(false);
      }
    }, 1000) as unknown as NodeJS.Timeout;

    return () => clearTimeout(typingTimeout);
  }, [newMessage, chat, isTyping]);

  // Updated message sending logic
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading || !chat) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chatId: chat._id,
          content: newMessage,
          isCustomerTyping: false
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setChat(data.chat);
      setNewMessage('');
    } catch (err) {
      console.error('Chat Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const chatElement = document.getElementById('chat-container');
      const target = event.target as Node;

      if (chatElement && !chatElement.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add this useEffect to update unread count
  useEffect(() => {
    if (chat?.messages && chat.messages.length > 0) {
      const newUnreadCount = chat.messages.filter(
        msg => msg.sender === 'assistant' && !isOpen
      ).length;
      setUnreadCount(newUnreadCount);
    }
  }, [chat, isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnreadCount(0); // Reset count when opening
        }}
        aria-label="Toggle chat"
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div
          id="chat-container"
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col h-[400px]">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold">Chat</h3>
              {/* <Link
                href="/dashboard/chat"
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Open in page
              </Link> */}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat?.messages.map((message) => (
                <div
                  key={message.timestamp.toString()}
                  className={`flex ${!message.isAgent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 ${
                      !message.isAgent
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {(chat?.isAgentTyping || isTyping) && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 