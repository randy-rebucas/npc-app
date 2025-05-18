'use server';

import { signIn, signOut } from '@logto/next/server-actions';
import { logtoConfig } from '../logto';
import { cookies } from 'next/headers';
import { handleAsync } from '@/lib/errorHandler';
import { AuthenticationError } from '@/lib/errors';
import { getLogtoContext } from '@logto/next/server-actions';

export async function handleSignIn(redirectUrl?: string) {
    const [result, error] = await handleAsync(
        signIn(logtoConfig, { 
            redirectUri: redirectUrl || '/'
        })
    );

    if (error) {
        throw new AuthenticationError('Failed to sign in');
    }

    return result;
}

export async function handleSignOut(redirectUrl?: string) {
    const cookieStore = await cookies();
    
    const [result, error] = await handleAsync(
        signOut(logtoConfig, redirectUrl || '/')
    );

    if (error) {
        throw new AuthenticationError('Failed to sign out');
    }

    // Clear all auth-related cookies
    const authCookies = ['logtoToken', 'session', 'logto'];
    authCookies.forEach(cookie => {
        cookieStore.delete(cookie);
    });

    return result;
}

export async function validateSession() {
    const [context, error] = await handleAsync(getLogtoContext(logtoConfig));

    if (error || !context?.isAuthenticated) {
        throw new AuthenticationError('No valid session found');
    }

    return {
        isAuthenticated: context.isAuthenticated,
        claims: context.claims
    };
}

export async function getCurrentUser() {
    const [context, error] = await handleAsync(getLogtoContext(logtoConfig));

    if (error || !context?.claims) {
        throw new AuthenticationError('Failed to get current user');
    }

    return {
        id: context.claims.sub,
        email: context.claims.email,
        name: context.claims.name,
        // Add any other user claims you need
    };
} 