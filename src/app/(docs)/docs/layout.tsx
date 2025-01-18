import Link from "next/link";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white py-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Sidebar Navigation */}
                    <aside className="w-64 shrink-0">
                        <nav className="sticky top-4 rounded-lg border border-gray-200 bg-white p-4">
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/docs" className="text-blue-600 hover:text-blue-800">Getting Started</Link>
                                </li>
                                <li>
                                    <Link href="/docs/installation" className="text-blue-600 hover:text-blue-800">Installation</Link>
                                </li>
                                <li>
                                    <Link href="/docs/usage" className="text-blue-600 hover:text-blue-800">Usage</Link>
                                </li>
                                <li>
                                    <Link href="/docs/api-reference" className="text-blue-600 hover:text-blue-800">API Reference</Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 rounded-lg border border-gray-200 bg-white p-6">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}