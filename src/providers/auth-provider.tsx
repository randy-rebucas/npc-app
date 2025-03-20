"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { SessionProvider, useSession } from "@/providers/logto-session-provider";

interface User {
  role: "PHYSICIAN" | "NURSE_PRACTITIONER" | null;
  onBoardingStatus: "COMPLETE" | "INCOMPLETE";
}

function OnboardingCheck({ children }: { children: React.ReactNode }) {
    const { user } = useSession();
    const router = useRouter();

    const fetchUser = useCallback(async (userId: string) => {
        try {
            const response = await fetch(`/api/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const user: User = await response.json();
            
            if (!user.role) {
                router.push("/onboarding");
            } else if (user.onBoardingStatus === "INCOMPLETE") {
                const route = user.role === "PHYSICIAN" 
                    ? "/onboarding/physician"
                    : "/onboarding/nurse-practitioner";
                router.push(route);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [router]);

    useEffect(() => {
        if (user?.id) {
            fetchUser(user.id);
        }
    }, [user, fetchUser]);

    return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <OnboardingCheck>{children}</OnboardingCheck>
        </SessionProvider>
    );
} 