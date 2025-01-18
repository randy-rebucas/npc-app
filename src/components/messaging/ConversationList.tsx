'use client';

import { IUser } from '@/app/models/User';
import { useMessaging } from '@/providers/messaging-provider';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function ConversationList() {
    const { data: session } = useSession();
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

                setUsers(data.filter((u: IUser) => u.id !== session?.user?.id));
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, [session]);

    const getLastMessage = (userId: string) => {
        return messages
            .filter(m =>
                (m.senderId.toString() === userId && m.receiverId.toString() === session?.user?.id) ||
                (m.senderId.toString() === session?.user?.id && m.receiverId.toString() === userId)
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    };

    return (
        <div className="border-r h-full bg-white">
            <div className="py-6 px-4">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Conversations</h2>
                <div className="space-y-3">
                    {users.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 font-medium">No conversations available</p>
                            <p className="text-sm text-gray-500 mt-2">
                                There are no other users available to message at this time
                            </p>
                        </div>
                    ) : (
                        users.map(user => {
                            const lastMessage = getLastMessage(user._id as string);
                            return (
                                <Link
                                    key={user._id as string}
                                    href={`/dashboard/messages/${user._id}`}
                                    className="block w-full p-4 text-left rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100 hover:border-gray-200"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.username}</p>
                                            <p className="text-sm text-gray-600">{user.role}</p>
                                        </div>
                                        {lastMessage && (
                                            <span className="text-xs text-gray-500">
                                                {new Date(lastMessage.timestamp).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    {lastMessage && (
                                        <p className="text-sm text-gray-600 truncate mt-2">
                                            {lastMessage.content}
                                        </p>
                                    )}
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}