'use client'

import { ThemeProvider } from "next-themes";    
import { redirect } from "next/navigation";
import { useSession } from "@/providers/logto-session-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { claims } = useSession();

    if (claims?.customData?.role !== "physician") {
        redirect("/np/find-match");
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