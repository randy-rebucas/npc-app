'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      });

      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      // setError('Failed to send message. Please try again.');
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

  // Load previous messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch('/api/chat/history');
        // if (!response.ok) throw new Error('Failed to load messages');
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        console.error('Failed to load messages:', err);
        // setError('Failed to load message history');
      }
    };

    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  // Add this useEffect to update unread count
  useEffect(() => {
    if (messages && messages.length > 0) {
      const newUnreadCount = messages.filter(
        msg => msg.sender === 'assistant' && !isOpen
      ).length;
      setUnreadCount(newUnreadCount);
    }
  }, [messages, isOpen]);

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
              <Link
                href="/dashboard/chat"
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Open in page
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages && messages.length > 0 && messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-2 ${message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
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