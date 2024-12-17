

// src/lib/types/onboarding.ts
export interface OnboardingFormData {
    // Step 1: User Information
    firstName: string;
    lastName: string;
    email: string;
  
    // Step 2: License Information
    medicalLicenseStates: string[];
    deaLicenseStates: string[];
  
    // Step 3: Clinical Practice Types
    practiceTypes: string[];
  
    // Step 4: Rate Matrix
    monthlyCollaborationRate: number;
    additionalStateFee: number;
    additionalNPFee: number;
    controlledSubstancesMonthlyFee: number;
    controlledSubstancesPerPrescriptionFee: number;
  
    // Step 5: Background & Certifications
    description: string;
    boardCertification: string;
    additionalCertifications: string[];
    linkedinProfile: string;
  
    // Step 6: Profile Photo
    profilePhotoUrl: File | null;
  
    // Step 7: Government ID
    governmentIdUrl: File | null;
  }