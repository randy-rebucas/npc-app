'use client'

import { ThemeProvider } from "next-themes";
import { useSession } from "@/providers/logto-session-provider";
import { useState, useEffect } from "react";
import { getUser } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { IUser } from "@/app/models/User";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { claims } = useSession();
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!claims?.sub) {
            redirect('/login'); // Redirect to login if no claims
            return;
        }

        const getUserData = async () => {
            try {
                if (!claims.sub) return;
                const userData = await getUser(claims.sub);
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        }
        getUserData();
    }, [claims?.sub]);

    useEffect(() => {
        if (!isLoading && user?.customData?.role !== "nurse-practitioner") { 
            redirect("/np/main"); // Redirect to home if not a nurse practitioner
        }
    }, [user, isLoading]);

    if (isLoading) {
        return <div>Loading...</div>; // Or your loading component
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