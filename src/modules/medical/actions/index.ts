'use server';

import { DatabaseError, NotFoundError } from '@/modules/core/errors';
import { PaginationParams } from '@/modules/core/types';
import { License, Practice } from '../types';

export class MedicalActions {
  static async getLicenses(userId: string): Promise<License[]> {
    try {
      // Implementation for fetching user licenses
      return await db.licenses.findMany({ where: { userId } });
    } catch (error) {
      throw new DatabaseError('Failed to fetch licenses');
    }
  }

  static async addLicense(userId: string, licenseData: Omit<License, 'id'>): Promise<License> {
    try {
      // Implementation for adding new license
      return await db.licenses.create({
        data: { ...licenseData, userId }
      });
    } catch (error) {
      throw new DatabaseError('Failed to add license');
    }
  }

  static async updatePractice(practiceId: string, data: Partial<Practice>): Promise<Practice> {
    try {
      // Implementation for updating practice details
      return await db.practices.update({
        where: { id: practiceId },
        data
      });
    } catch (error) {
      throw new DatabaseError('Failed to update practice');
    }
  }
} 