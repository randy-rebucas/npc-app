'use client';

import { IUser } from '@/app/models/User';
import { useMessaging } from '@/providers/messaging-provider';
import { useSession } from "@/providers/logto-session-provider";
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function ConversationList({ receiverId }: { receiverId: string | null }) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const { claims } = useSession();
    const [users, setUsers] = useState<IUser[]>([]);
    const { messages } = useMessaging();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/messages/users');
                const data = await response.json();

                // Check if data is empty
                if (Object.keys(data).length === 0) {
                    console.warn('No users returned from API');
                    setUsers([]);
                    return;
                }

                // Check if data is an array
                if (!Array.isArray(data)) {
                    console.error('Expected array of users but received:', data);
                    setUsers([]);
                    return;
                }

                setUsers(data.filter((u: IUser) => u.id !== claims?.sub));
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, [claims?.sub]);

    const getLastMessage = (userId: string) => {
        return messages
            .filter(m =>
                (m.senderId.toString() === userId && m.receiverId.toString() === claims?.sub) ||
                (m.senderId.toString() === claims?.sub && m.receiverId.toString() === userId)
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    };

    const getMessageThread = (userId: string) => {
        const params = new URLSearchParams(searchParams);
        if (userId) {
            params.set('receiverId', userId);
        } else {
            params.delete('receiverId');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="border-r border-border h-full bg-card">
            <div className="py-6 px-4">
                <h2 className="text-xl font-bold mb-6 text-foreground">Conversations</h2>
                <div className="space-y-3">
                    {users.length === 0 ? (
                        <div className="text-center py-12 bg-muted rounded-lg">
                            <p className="text-foreground font-medium">No conversations available</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                There are no other users available to message at this time
                            </p>
                        </div>
                    ) : (
                        users.map(user => {
                            const lastMessage = getLastMessage(user._id as string);
                            return (
                                <Button
                                    key={user._id as string}
                                    onClick={() => getMessageThread(user._id as string)}
                                    className={`block w-full px-4 py-2.5 text-left rounded-lg transition-colors 
                                              duration-200 hover:bg-muted h-[72px] 
                                              ${user._id === receiverId ? 'bg-muted' : 'border-border'} border`}
                                    variant="ghost"
                                >
                                    <div className="flex items-start gap-3 h-full">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary">
                                                {user.username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-medium text-foreground truncate">{user.username}</p>
                                                {lastMessage && (
                                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                                        {new Date(lastMessage.timestamp).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                {lastMessage ? (
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {lastMessage.content}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">
                                                        No messages yet
                                                    </p>
                                                )}
                                                <span className="text-xs text-muted-foreground ml-2">{user.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}