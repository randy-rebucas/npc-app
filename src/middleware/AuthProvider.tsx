'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { validateSession, getCurrentUser } from '@/app/actions/auth';
import { logtoConfig } from '@/app/logto';
import { signOut, signIn } from '@logto/next/server-actions';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    handleSignIn: () => Promise<void>;
    handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    loading: true,
    handleSignIn: async () => {},
    handleLogout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const handleSignIn = useCallback(async () => {
        try {
            await signIn(logtoConfig);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);
    
    const handleLogout = useCallback(async () => {
        try {
            await signOut(logtoConfig);
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        const initAuth = async () => {
            try {
                await validateSession();
                const userData = await getCurrentUser();
                setIsAuthenticated(true);
                setUser(userData as User);
            } catch (error) {
                console.error('Auth error:', error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, handleLogout, handleSignIn }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext); 
