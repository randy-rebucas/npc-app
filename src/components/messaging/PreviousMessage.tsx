'use client';

import { useMessaging } from "@/providers/messaging-provider";
import { useMemo } from "react";

export function PreviousMessage({ physicianId }: { physicianId: string }) {

    const { messages, getSenderName } = useMessaging();

    // Memoize filtered messages to prevent unnecessary recalculations
    const filteredMessages = useMemo(() => {
        return messages.filter(m =>
            (m.senderId.toString() === physicianId) || (m.receiverId.toString() === physicianId)
        );
    }, [messages, physicianId]);

    return (
        <div className="space-y-4">
            {filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
                    <p className="text-lg font-medium text-foreground">No messages yet</p>
                    <p className="text-sm">Start a conversation by sending a message below!</p>
                </div>
            ) : (
                filteredMessages.map(message => (
                    <div key={message._id as string} className="flex items-start space-x-3 bg-muted p-4 rounded-lg">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-1">From: {getSenderName(message.senderId.toString())}</p>
                            <p className="text-sm text-muted-foreground mb-2">Sent: {new Date(message.timestamp).toLocaleDateString()}</p>
                            <div className="bg-card p-3 rounded border border-border">
                                <p className="text-foreground">
                                    {message.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}