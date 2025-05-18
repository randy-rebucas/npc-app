'use client';

import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: "/docs", label: "Getting Started" },
        { href: "/docs/installation", label: "Installation" },
        { href: "/docs/usage", label: "Usage" },
        { href: "/docs/api-reference", label: "API Reference" },
    ];

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <main className="min-h-screen bg-background">
                <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm py-4">
                    <div className="container mx-auto px-4">
                        <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex gap-6">
                        {/* Sidebar Navigation */}
                        <aside className="w-64 shrink-0">
                            <nav className="sticky top-24 rounded-lg border border-border bg-card p-4">
                                <ul className="space-y-2">
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <Link 
                                                href={item.href}
                                                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                                                    pathname === item.href 
                                                        ? "bg-primary text-primary-foreground" 
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                }`}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
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