'use server';

import { sdk } from '@/config/sharetribe';
import { DatabaseError } from '@/modules/core/errors';
import { PaginationParams, PaginatedResponse } from '@/modules/core/types';
import { User, UserProfile } from '../types';

export class UserActions {
  static async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = await sdk.currentUser.show();
      return currentUser || null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch current user');
    }
  }

  static async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // Implementation for updating user profile
      return await sdk.users.updateProfile(userId, data);
    } catch (error) {
      throw new DatabaseError('Failed to update user profile');
    }
  }
} 