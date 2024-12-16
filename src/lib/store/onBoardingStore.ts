import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OnboardingFormData } from "../types/onboarding";

export type State = {
  onBoarding: OnboardingFormData;
};

export type Actions = {
  updateFields: (fields: Partial<OnboardingFormData>) => void;
  reset: () => void;
};

export const INITIAL_ON_BOARDING_DATA: OnboardingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  medicalLicenseStates: [],
  deaLicenseStates: [],
  practiceTypes: [],
  monthlyCollaborationRate: 0,
  additionalStateFee: 0,
  additionalNPFee: 0,
  controlledSubstancesMonthlyFee: 0,
  controlledSubstancesPerPrescriptionFee: 0,
  description: "",
  boardCertification: "",
  additionalCertifications: [],
  linkedinProfile: "",
  profilePhotoUrl: "",
  governmentIdUrl: "",
};

export const useOnBoardingStore = create<State & Actions>()(
  persist(
    (set) => ({
      onBoarding: INITIAL_ON_BOARDING_DATA,
      updateFields: (fields) =>
        set((state) => ({
          onBoarding: { ...state.onBoarding, ...fields },
        })),
      reset: () =>
        set(() => ({
          onBoarding: INITIAL_ON_BOARDING_DATA,
        })),
    }),
    { name: "on-boarding", skipHydration: true }
  )
);
