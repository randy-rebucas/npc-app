'use client';

import { useMessaging } from '@/providers/messaging-provider';
import { useMemo, useState } from 'react';

export function ComposeMessage({ physicianId }: { physicianId: string }) {
    const { messages, sendMessage } = useMessaging();
    const [newMessage, setNewMessage] = useState('');

    // Memoize filtered messages to prevent unnecessary recalculations
    const filteredMessages = useMemo(() => {
        return messages.filter(m =>
            (m.senderId.toString() === physicianId) || (m.receiverId.toString() === physicianId)
        );
    }, [messages, physicianId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        await sendMessage(physicianId, newMessage);
        setNewMessage('');
    };

    return (
        <div>
            <label htmlFor={filteredMessages.length > 0 ? 'reply' : 'message'} className="block text-sm font-medium text-gray-700 mb-2">
                {filteredMessages.length > 0 ? 'Reply' : 'Message'}
            </label>
            <textarea
                id={filteredMessages.length > 0 ? 'reply' : 'message'}
                name={filteredMessages.length > 0 ? 'reply' : 'message'}
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder={filteredMessages.length > 0 ? 'Type your reply here...' : 'Type your message here...'}
                required
            />
            <div className="mt-4 flex justify-end space-x-2">
                <button
                    onClick={handleSend}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Send {filteredMessages.length > 0 ? 'Reply' : 'Message'}
                </button>
            </div>
        </div>
    )
}