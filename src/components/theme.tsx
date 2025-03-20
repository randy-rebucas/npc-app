'use client';

import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <ThemeToggle theme={theme as "light" | "dark"} setTheme={setTheme} />
    );
}   
