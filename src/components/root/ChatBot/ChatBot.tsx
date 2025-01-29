'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const INITIAL_BOT_MESSAGE: Message = {
    id: '0',
    text: "👋 Hi! How can I help you today?",
    sender: 'bot',
    timestamp: new Date(),
};

export default function ChatBot() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        setIsLoading(true);
        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputText,
                    customerId: session?.user?.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || "Thanks for your message! Our team will get back to you soon.",
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            // Add error message to chat
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, there was an error processing your message. Please try again.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Add auto-scroll effect
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M22 2L15 9M22 2L15 2M22 2L22 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden" role="dialog" aria-label="Chat window">
                    <div className="bg-blue-600 text-white p-4 shadow">
                        <h3 className="text-lg font-semibold">Chat Support</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex flex-col max-w-[80%] ${
                                    message.sender === 'user' 
                                        ? 'ml-auto items-end' 
                                        : 'mr-auto items-start'
                                }`}
                                role={message.sender === 'bot' ? 'alert' : undefined}
                            >
                                <div className={`rounded-lg px-4 py-2 ${
                                    message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {message.text}
                                </div>
                                <span className="text-xs text-gray-500 mt-1" aria-label={`Sent at ${new Date(message.timestamp).toLocaleTimeString()}`}>
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t p-4 bg-gray-50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder="Type your message..."
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                aria-label="Chat message input"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
                                disabled={!inputText.trim() || isLoading}
                                aria-label={isLoading ? 'Sending message...' : 'Send message'}
                            >
                                {isLoading ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 