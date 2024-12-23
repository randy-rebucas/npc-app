"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

function OnboardingCheck({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const router = useRouter();

    const fetchUser = useMemo(() => {
        return async (userId: string) => {
            const response = await fetch(`/api/user/${userId}`);
            const user = await response.json();
            if (user?.onboardingStatus === "incomplete") {
                router.push("/onboarding");
            }
        };
    }, [router]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchUser(session.user.id);
        }
    }, [session, fetchUser]);

    return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <OnboardingCheck>{children}</OnboardingCheck>
        </SessionProvider>
    );
} 