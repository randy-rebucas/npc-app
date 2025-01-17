'use client';

import { useMessaging } from '@/providers/messaging-provider';
import { useState } from 'react';

export function MessageThread({ receiverId }: { receiverId: string }) {
  const { messages, sendMessage } = useMessaging();
  const [newMessage, setNewMessage] = useState('');

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(receiverId, newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter(m => 
            (m.senderId.toString() === receiverId) || (m.receiverId.toString() === receiverId)
          )
          .map(message => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.senderId.toString() === receiverId
                  ? 'bg-gray-100 mr-auto'
                  : 'bg-blue-500 text-white ml-auto'
              }`} >
              {message.content}
            </div>
          ))}
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-lg border p-2"
            placeholder="Type your message..."/>
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 