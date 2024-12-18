import { memberstack } from "@/config/memberstack-admin";

interface CreateMember {
  email: string;
  password: string;
  customFields?: object;
  metaData?: object;
  json?: object;
  loginRedirect?: string;
  plans?: {
    planId: string;
  }[];
}

export class MemberstackAdminService {
  // Get member by ID
  static async getMemberById(memberId: string) {
    try {
      const member = await memberstack.members.retrieve({ id: memberId });
      return member;
    } catch (error) {
      console.error("Error getting member:", error);
      throw error;
    }
  }

  // Get member by email
  static async getMemberByEmail(email: string) {
    try {
      const members = await memberstack.members.retrieve({ email });
      return members; // Returns the first match
    } catch (error) {
      console.error("Error searching member:", error);
      throw error;
    }
  }

  // Create member
  static async createMember(memberData: CreateMember) {
    try {
      const member = await memberstack.members.create(memberData);
      return member;
    } catch (error) {
      console.error("Error creating member:", error);
      throw error;
    }
  }

  // Update member
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async updateMember(memberId: string, updateData: any) {
    try {
      const updated = await memberstack.members.update({
        id: memberId,
        ...updateData,
      });
      return updated;
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    }
  }

  // Delete member
  static async deleteMember(memberId: string) {
    try {
      await memberstack.members.delete({ id: memberId });
      return true;
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
    }
  }

  // Add member to plan
  static async addMemberToPlan(memberId: string, planId: string) {
    try {
      const updated = await memberstack.members.addFreePlan({
        id: memberId,
        data: {
          planId: planId,
        },
      });
      return updated;
    } catch (error) {
      console.error("Error adding plan to member:", error);
      throw error;
    }
  }

  // Remove member from plan
  static async removeMemberFromPlan(memberId: string, planId: string) {
    try {
      const updated = await memberstack.members.removeFreePlan({
        id: memberId,
        data: {
          planId: planId,
        },
      });
      return updated;
    } catch (error) {
      console.error("Error removing plan from member:", error);
      throw error;
    }
  }

  // List all members with pagination
  static async listMembers(after = 1, limit = 10) {
    try {
      const members = await memberstack.members.list({
        after,
        limit,
      });
      return members;
    } catch (error) {
      console.error("Error listing members:", error);
      throw error;
    }
  }
}
