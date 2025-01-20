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

export type License = {
  state: string;
  licenseNumber: string;
  expirationDate: Date | null;
}

export type UserProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export type LicenseAndCertification = {
  medicalLicenseStates: License[];
  deaLicenseStates: License[];
}

export type RateMatrix = {
  monthlyCollaborationRate: number;
  additionalStateFee: number;
  additionalNPFee: number;
  controlledSubstancesMonthlyFee: number;
  controlledSubstancesPerPrescriptionFee: number;
}

export type BackgroundCertification = {
  description: string;
  boardCertification: string;
  additionalCertifications: Certification[];
  linkedinProfile: string;
}

export type Education = {
  undergrad: string;
  medical: string;
  residency: string;
}

export type ProfilePhotoUrl = {
  profilePhotoUrl: File | null;
}

export type GovernmentIdUrl = {
  governmentIdUrl: File | null;
} 

export type NpiNumber = {
  npiNumber: string;
}

export type Certification = {
  certification: string;
  issueDate: Date | null;
  expirationDate: Date | null;
  certificateUrl: string;
  certificateNumber: string;
}

export interface OnboardingFormData {
    id?: string;
    // Step 1: User Information
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    // Step 2: License Information
    medicalLicenseStates: License[];
    deaLicenseStates: License[];
  
    // Step 3: Clinical Practice Types
    practiceTypes: string[];
    npiNumber: string;

    // Step 4: Rate Matrix
    monthlyCollaborationRate: number;
    additionalStateFee: number;
    additionalNPFee: number;
    controlledSubstancesMonthlyFee: number;
    controlledSubstancesPerPrescriptionFee: number;
  
    // Step 5: Background & Certifications
    description: string;
    boardCertification: string;
    additionalCertifications: Certification[];
    linkedinProfile: string;
  
    // Step 6: Profile Photo
    profilePhotoPath: string;
    profilePhotoUrl: File | null;
  
    // Step 7: Government ID
    governmentIdPath: string;
    governmentIdUrl: File | null;
  }