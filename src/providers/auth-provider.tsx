"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function OnboardingCheck({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`/api/user/${session?.user?.id}`);
            const user = await response.json();
            if (user?.onboardingStatus === "incomplete") {
                router.push("/onboarding");
            }
        };
        fetchUser();
    }, [session, router]);

    return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <OnboardingCheck>{children}</OnboardingCheck>
        </SessionProvider>
    );
} 