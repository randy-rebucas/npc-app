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
            <label htmlFor={filteredMessages.length > 0 ? 'reply' : 'message'} className="block text-sm font-medium text-foreground mb-2">
                {filteredMessages.length > 0 ? 'Reply' : 'Message'}
            </label>
            <textarea
                id={filteredMessages.length > 0 ? 'reply' : 'message'}
                name={filteredMessages.length > 0 ? 'reply' : 'message'}
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-background text-foreground"
                placeholder={filteredMessages.length > 0 ? 'Type your reply here...' : 'Type your message here...'}
                required
            />
            <div className="mt-4 flex justify-end space-x-2">
                <button
                    onClick={handleSend}
                    className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
                >
                    Send {filteredMessages.length > 0 ? 'Reply' : 'Message'}
                </button>
            </div>
        </div>
    )
}