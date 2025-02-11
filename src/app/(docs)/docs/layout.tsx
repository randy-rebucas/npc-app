import Link from "next/link";
import { ThemeProvider } from "next-themes";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <main className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b border-border bg-card py-4">
                    <div className="container mx-auto px-4">
                        <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex gap-6">
                        {/* Sidebar Navigation */}
                        <aside className="w-64 shrink-0">
                            <nav className="sticky top-4 rounded-lg border border-border bg-card p-4">
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/docs" className="text-primary hover:text-primary/80">Getting Started</Link>
                                    </li>
                                    <li>
                                        <Link href="/docs/installation" className="text-primary hover:text-primary/80">Installation</Link>
                                    </li>
                                    <li>
                                        <Link href="/docs/usage" className="text-primary hover:text-primary/80">Usage</Link>
                                    </li>
                                    <li>
                                        <Link href="/docs/api-reference" className="text-primary hover:text-primary/80">API Reference</Link>
                                    </li>
                                </ul>
                            </nav>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 rounded-lg border border-border bg-card p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </ThemeProvider>
    )
}