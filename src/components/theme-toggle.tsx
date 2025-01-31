"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ 
    theme, 
    setTheme 
}: { 
    theme: 'light' | 'dark', 
    setTheme: (theme: 'light' | 'dark') => void 
}) {
    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative"
        >
            {theme === "dark" ? (
                <Sun className="h-6 w-6 transition-all"/>
            ) : (
                <Moon className="h-6 w-6 transition-all" />
            )}
        </button>
    );
} 