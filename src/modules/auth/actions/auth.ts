'use server';

import { logtoConfig } from '@/config/logto';
import { signIn, signOut } from '@logto/next/server-actions';

export class AuthActions {
  static async signIn() {
    await signIn(logtoConfig);
  }

  static async signOut() {
    await signOut(logtoConfig);
  }
} 