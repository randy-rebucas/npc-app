'use client';

import { logtoConfig } from '@/app/logto';
import { getLogtoContext, signIn, signOut } from '@logto/next/server-actions';
import React, { createContext, useCallback, useEffect, useState } from 'react';

type SessionContextType = {
    isAuthenticated: boolean;
    claims: {
        sub?: string;
        name?: string;
        username?: string;
        phone?: string;
        email?: string;
        [key: string]: unknown;
    };
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function LogtoProvider({ 
    children
}: { 
    children: React.ReactNode;
}) {
    const [sessionData, setSessionData] = useState<SessionContextType>({
        isAuthenticated: false,
        claims: {},
    });

    // Initialize session on mount
    useEffect(() => {
        const initSession = async () => {
            try {
                const { isAuthenticated, claims } = await getLogtoContext(logtoConfig, { fetchUserInfo: true });
                const sanitizedClaims = claims ? Object.fromEntries(
                    Object.entries(claims).map(([k, v]) => [k, v === null ? undefined : v])
                ) : {};
                setSessionData({ isAuthenticated, claims: sanitizedClaims });
            } catch (error) {
                console.error('Failed to initialize session:', error);
            }
        };

        initSession();
    }, []);

    return (
        <SessionContext.Provider value={sessionData}>
            {children}
        </SessionContext.Provider>
    );
}

// Custom hook to access Logto session with additional features
export function useSession() {
    const [isLoading, setIsLoading] = useState(false);
    const [sessionData, setSessionData] = useState<{
        isAuthenticated: boolean;
        claims: {
            sub?: string;
            name?: string;
            username?: string;
            phone?: string;
            email?: string;
            [key: string]: unknown;
        };
    }>({
        isAuthenticated: false,
        claims: {},
    });

    // Fetch session data on mount
    useEffect(() => {
        const fetchSession = async () => {
            setIsLoading(true);
            try {
                const { isAuthenticated, claims } = await getLogtoContext(logtoConfig, { fetchUserInfo: true });
                const sanitizedClaims = claims ? Object.fromEntries(
                    Object.entries(claims).map(([k, v]) => [k, v === null ? undefined : v])
                ) : {};
                setSessionData({ isAuthenticated, claims: sanitizedClaims });
            } catch (error) {
                console.error('Failed to fetch session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
    }, []);

    // Enhanced sign-in with loading state
    const handleSignIn = useCallback(async () => {
        setIsLoading(true);
        try {
            await signIn(logtoConfig);
            // Refresh session data after sign-in
            const { isAuthenticated, claims } = await getLogtoContext(logtoConfig, { fetchUserInfo: true });
            const sanitizedClaims = claims ? Object.fromEntries(
                Object.entries(claims).map(([k, v]) => [k, v === null ? undefined : v])
            ) : {};
            setSessionData({ isAuthenticated, claims: sanitizedClaims });
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error; // Propagate error to caller
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Enhanced sign-out with loading state
    const handleSignOut = useCallback(async () => {
        setIsLoading(true);
        try {
            await signOut(logtoConfig);
            setSessionData({ isAuthenticated: false, claims: {} });
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error; // Propagate error to caller
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isAuthenticated: sessionData.isAuthenticated,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        user: sessionData.claims,
    };
}