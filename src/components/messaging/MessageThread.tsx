'use client';

import { useMessaging } from '@/providers/messaging-provider';
import { useState, useMemo } from 'react';

export function MessageThread({ receiverId }: { receiverId: string }) {
  const { messages, sendMessage } = useMessaging();
  const [newMessage, setNewMessage] = useState('');

  // Memoize filtered messages to prevent unnecessary recalculations
  const filteredMessages = useMemo(() => {
    return messages.filter(m => 
      (m.senderId.toString() === receiverId) || (m.receiverId.toString() === receiverId)
    );
  }, [messages, receiverId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(receiverId, newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg font-medium text-foreground">No messages yet</p>
            <p className="text-sm">Start a conversation by sending a message below!</p>
          </div>
        ) : (
          filteredMessages.map(message => (
            <div
              key={message._id as string}
              className={`flex ${
                message.senderId.toString() === receiverId ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[70%] break-words ${
                  message.senderId.toString() === receiverId
                    ? 'bg-muted text-foreground rounded-tr-lg rounded-tl-lg rounded-br-lg'
                    : 'bg-primary text-primary-foreground rounded-tr-lg rounded-tl-lg rounded-bl-lg'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background text-foreground p-2"
            placeholder="Type your message..."/>
          <button
            onClick={handleSend}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 