"use client"


import { useState } from "react";
import { useEffect } from "react";
import { useSession } from "@/providers/logto-session-provider";
import { IChat } from "@/app/models/Chat";

export default function ChatPage() {
    const { user } = useSession();
    const [chats, setChats] = useState<IChat[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/chat/history?chatId=' + user.id);
                if (!response.ok) throw new Error('Failed to fetch chat history');
                const data = await response.json();
                setChats(data);
            } catch (err) {
                console.error('Failed to load data:', err);
                setError('Failed to load chat data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    // Helper function to format date
    // const formatDate = (date: Date) => {
    //     const now = new Date();
    //     const messageDate = new Date(date);
        
    //     if (messageDate.toDateString() === now.toDateString()) {
    //         return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    //     }
    //     return messageDate.toLocaleDateString();
    // };

    if (isLoading) return <div className="p-4">Loading chats...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!chats?.length) return <div className="p-4">No chats found</div>;

    return (
        <>
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Chats</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                    <div
                        key={chat._id}
                        onClick={() => setActiveChat(chat._id)}
                        className={`p-4 hover:bg-gray-100 cursor-pointer flex items-center space-x-3 ${
                            activeChat === chat._id ? 'bg-gray-100' : ''
                        }`}
                    >
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h3 className="font-semibold">
                                    {chat.customerId && typeof chat.customerId === 'object' && 'username' in chat.customerId 
                                        ? chat.customerId.username 
                                        : 'Unknown User'}
                                </h3>
                                {/* <span className="text-xs text-gray-500">
                                    {formatDate(chat.lastActivity)}
                                </span> */}
                            </div>
                            {/* <p className="text-sm text-gray-500 truncate"> */}
                                {/* {chat.messages?.[chat.messages.length - 1]?.content || 'No messages'} */}
                            {/* </p> */}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
