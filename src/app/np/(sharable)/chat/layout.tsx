import Header from "@/components/header";

// Add proper TypeScript props interface
interface ChatLayoutProps {
    children: React.ReactNode;
    detail: React.ReactNode;
}

export default function ChatLayout({ children, detail }: ChatLayoutProps) {
    return (
        <div className="bg-white min-h-screen w-full text-gray-900">
            <Header />
            <main className="max-w-[1800px] mx-auto px-4">
                <div className="flex h-[calc(100vh-64px)]">
                    {/* Chat Inbox Sidebar */}
                    <div className="w-[320px] border-r border-gray-200 flex flex-col overflow-hidden">
                        {children}
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {detail}
                    </div>
                </div>
            </main>
        </div>
    );
}