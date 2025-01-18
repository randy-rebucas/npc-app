'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupportChat } from "@/providers/support-chat-provider";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export function SupportChat() {
    const { isOpen, messages, isLoading, unreadCount, toggleChat, sendMessage } = useSupportChat();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Alt/Option + C to toggle chat
            if (e.altKey && e.key === 'c') {
                toggleChat();
            }
            // Escape to close chat
            if (e.key === 'Escape' && isOpen) {
                toggleChat();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, toggleChat]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            await sendMessage(input);
            setInput("");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
            console.error("Failed to send message:", error);
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <Button
                onClick={toggleChat}
                className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg"
                size="icon"
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -right-3 -top-3 h-5 w-5 rounded-full p-0 text-xs"
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                )}
            </Button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 h-[500px] w-[350px] rounded-lg border bg-background shadow-lg">
                    <div className="flex h-full flex-col">
                        {/* Header */}
                        <div className="border-b p-4">
                            <h2 className="font-semibold">Support Chat</h2>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                            {messages?.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    <p>No messages yet. Start a conversation!</p>
                                </div>
                            ) : (
                                <>
                                    {Array.isArray(messages) && messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "mb-4 max-w-[80%] rounded-lg p-3",
                                                message.sender === "user"
                                                    ? "ml-auto bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            )}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <span className="mt-1 text-xs opacity-70">
                                                {new Date(message.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                            {isLoading && (
                                <div className="flex justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </ScrollArea>

                        {/* Input */}
                        <form onSubmit={handleSend} className="border-t p-4">
                            <div className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                />
                                <Button type="submit" size="icon" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}