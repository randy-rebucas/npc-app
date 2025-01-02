import Header from "@/components/header";

export default function ChatPage() {
    const breadcrumbs = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Chat", href: "/dashboard/chat", active: true },
    ];

    return (

        <div className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={breadcrumbs} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col h-screen bg-gray-50">
                    {/* Chat Header */}
                    <div className="p-4 border-b bg-white">
                        <h1 className="text-xl font-semibold">Chat Messages</h1>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Message bubbles will go here */}
                        <div className="flex flex-col space-y-4">
                            {/* Example message structures */}
                            <div className="flex items-start gap-2.5">
                                <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
                                    <p className="text-sm font-normal text-gray-900">This is a sample message</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input Section */}
                    <div className="border-t bg-white p-4">
                        <form className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
