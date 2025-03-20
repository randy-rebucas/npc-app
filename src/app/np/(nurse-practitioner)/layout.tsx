'use client'

import { ThemeProvider } from "next-themes";
import { redirect } from "next/navigation";
import { useSession } from "@/providers/logto-session-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user } = useSession();

    if (user?.role !== "NURSE_PRACTITIONER") {
        redirect("/np/main");
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    );
}