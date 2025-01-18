'use client';

import { useSession } from 'next-auth/react';
import { createContext, useContext, useState, useEffect } from 'react';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'support';
    timestamp: Date;
}

interface SupportChatContextType {
    isOpen: boolean;
    messages: Message[];
    isLoading: boolean;
    toggleChat: () => void;
    closeChat: () => void;
    openChat: () => void;
    sendMessage: (content: string) => Promise<void>;
    markAsRead: () => void;
    unreadCount: number;
}

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined);

export function SupportChatProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load initial messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                setIsLoading(true);
                // TODO: Implement API call to fetch messages
                const response = await fetch('/api/support-messages');
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Failed to load messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, []);

    // Listen for new messages
    useEffect(() => {
        let socket: WebSocket;
        let reconnectTimer: NodeJS.Timeout;
        const MAX_RETRIES = 3;
        let retryCount = 0;
        let isConnecting = false;

        const connectWebSocket = async () => {
            if (isConnecting || !session?.user?.id) return;
            isConnecting = true;

            try {
                // Ensure we're using secure WebSocket for production
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const host = window.location.host;
                const wsUrl = `${protocol}//${host}/api/support-messages`;
                
                socket = new WebSocket(wsUrl);
                
                // Set a connection timeout
                const connectionTimeout = setTimeout(() => {
                    if (socket.readyState !== WebSocket.OPEN) {
                        socket.close();
                        throw new Error('WebSocket connection timeout');
                    }
                }, 5000);

                socket.onopen = () => {
                    clearTimeout(connectionTimeout);
                    console.log('WebSocket connected');
                    retryCount = 0;
                    isConnecting = false;
                    
                    // Send authentication message
                    socket.send(JSON.stringify({
                        type: 'auth',
                        userId: session.user.id
                    }));
                };

                socket.onmessage = (event) => {
                    try {
                        const newMessage = JSON.parse(event.data);
                        setMessages(prev => Array.isArray(prev) ? [...prev, newMessage] : [newMessage]);
                        if (!isOpen) setUnreadCount(prev => prev + 1);
                    } catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                };

                socket.onclose = (event) => {
                    console.log(`WebSocket closed with code ${event.code}`);
                    isConnecting = false;
                    
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        console.log(`Attempting to reconnect (${retryCount}/${MAX_RETRIES})...`);
                        reconnectTimer = setTimeout(connectWebSocket, 3000 * retryCount); // Exponential backoff
                    }
                };

                socket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    isConnecting = false;
                    socket.close();
                };
            } catch (error) {
                console.error('WebSocket connection failed:', error);
                isConnecting = false;
                
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    console.log(`Retrying connection in ${3 * retryCount} seconds...`);
                    reconnectTimer = setTimeout(connectWebSocket, 3000 * retryCount);
                }
            }
        };

        connectWebSocket();

        return () => {
            if (socket?.readyState === WebSocket.OPEN) {
                socket.close();
            }
            if (reconnectTimer) clearTimeout(reconnectTimer);
        };
    }, [isOpen, session]);

    const toggleChat = () => setIsOpen(prev => !prev);
    const closeChat = () => setIsOpen(false);
    const openChat = () => {
        setIsOpen(true);
        markAsRead();
    };

    const markAsRead = async () => {
        setUnreadCount(0);
    };

    const sendMessage = async (content: string) => {
        try {
            setIsLoading(true);
            const newMessage: Message = {
                id: Date.now().toString(),
                content,
                sender: 'user',
                timestamp: new Date(),
            };

            // TODO: Implement API call to send message
            await fetch('/api/support-messages', {
                method: 'POST',
                body: JSON.stringify({ content, senderId: session?.user?.id, receiverId: "666666666666666666666666" }),
            });

            setMessages(prev => Array.isArray(prev) ? [...prev, newMessage] : [newMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SupportChatContext.Provider
            value={{
                isOpen,
                messages,
                isLoading,
                toggleChat,
                closeChat,
                openChat,
                sendMessage,
                markAsRead,
                unreadCount,
            }}
        >
            {children}
        </SupportChatContext.Provider>
    );
}

export function useSupportChat() {
    const context = useContext(SupportChatContext);
    if (context === undefined) {
        throw new Error('useSupportChat must be used within a SupportChatProvider');
    }
    return context;
}