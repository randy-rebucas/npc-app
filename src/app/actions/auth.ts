'use server';

import { logtoConfig } from '../logto';
import { signIn, signOut } from '@logto/next/server-actions';

export async function handleSignIn() {
    await signIn(logtoConfig);
}

export async function handleSignOut() {
    await signOut(logtoConfig);
} 