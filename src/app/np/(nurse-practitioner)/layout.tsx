'use client'

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { getUser } from "@/app/actions/user";
import { redirect } from "next/navigation";
import { IUser } from "@/app/models/User";
import { useAuth } from "@/providers/AuthProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [userData, setUserData] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) {
            // redirect('/login'); // Redirect to login if no claims
            return;
        }

        const getUserData = async () => {
            try {
                if (!user?.id) return;
                const userData = await getUser(user.id);
                setUserData(userData);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setIsLoading(false);
            }
        }
        getUserData();
    }, [user?.id]);

    useEffect(() => {
        if (!isLoading && userData?.customData?.role !== "nurse-practitioner") { 
            redirect("/np/main"); // Redirect to home if not a nurse practitioner
        }
    }, [userData, isLoading]);

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