'use client';

import { useMessaging } from '@/providers/messaging-provider';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: 'PHYSICIAN' | 'NURSE_PRACTITIONER';
}


export function ConversationList() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const { messages } = useMessaging();
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/messages/users');
                const data = await response.json();
                console.log('Users:', data);
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

                setUsers(data.filter((u: User) => u.id !== session?.user?.id));
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

    const onSelectUser = (user: User) => {
        console.log('Selected user:', user);
        router.push(`/dashboard/messages/${user.id}`);
    };

    return (
        <div className="border-r h-full">
            <div className="py-4 px-2">
                <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                <div className="space-y-2">
                    {users.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No conversations available</p>
                            <p className="text-sm text-gray-400 mt-1">
                                There are no other users available to message at this time
                            </p>
                        </div>
                    ) : (
                        users.map(user => {
                            const lastMessage = getLastMessage(user.id);
                            return (
                                <button
                                    key={user.id}
                                    onClick={() => onSelectUser(user)}
                                    className="w-full p-3 text-left hover:bg-gray-100 rounded-lg"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.role}</p>
                                        </div>
                                        {lastMessage && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(lastMessage.timestamp).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    {lastMessage && (
                                        <p className="text-sm text-gray-600 truncate mt-1">
                                            {lastMessage.content}
                                        </p>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}