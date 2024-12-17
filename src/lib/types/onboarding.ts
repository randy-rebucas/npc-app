import { UseFormReturn } from "react-hook-form";
import * as z from 'zod';

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<{ form: UseFormReturn<OnboardingFormData> }>;
  formSchema: z.ZodSchema;
  defaultValues: Partial<OnboardingFormData>;
};

export interface OnboardingFormData {
    id?: string;
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

    npiNumber: string;
  }