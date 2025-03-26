'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';
import { OnboardingFormData } from '@/lib/types/onboarding';
import { UseFormReturn } from 'react-hook-form';

const medicalLicenseStates = [
  'California', 'New York', 'Texas', 'Florida', 'Illinois',
  // Add more states as needed
];

const deaLicenseStates = [
  'California', 'New York', 'Texas', 'Florida', 'Illinois',
  // Add more states as needed
];

interface FormStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export default function LicenseInformationForm({ form }: FormStepProps) {

  const updateFields = useOnBoardingStore(state => state.updateFields);
  const onBoarding = useOnBoardingStore(state => state.onBoarding);

  return (
    <div className='flex flex-col gap-2'>
      <FormField
        control={form.control}
        name="licenseAndCertification.medicalLicenseStates"
        render={({ field }) => (
          <FormItem>
            <FormLabel>States with Medical License</FormLabel>
            <FormControl>
              <MultiSelect
                {...field}
                options={medicalLicenseStates.map(state => ({
                  label: state,
                  value: state,
                }))}
                value={onBoarding.licenseAndCertification.medicalLicenseStates.map(license => license.state)}
                onValueChange={(values) => updateFields({
                  licenseAndCertification: {
                    ...onBoarding.licenseAndCertification,
                    medicalLicenseStates: values.map(state => ({
                      state,
                      licenseNumber: "",
                      expirationDate: null
                    }))
                  }
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="licenseAndCertification.deaLicenseStates"
        render={({ field }) => (
          <FormItem>
            <FormLabel>States with DEA License</FormLabel>
            <FormControl>
              <MultiSelect
                {...field}
                options={deaLicenseStates.map(state => ({
                  label: state,
                  value: state,
                }))}
                value={onBoarding.licenseAndCertification.deaLicenseStates.map(license => license.state)}
                onValueChange={(values) => updateFields({
                  licenseAndCertification: {
                    ...onBoarding.licenseAndCertification,
                    deaLicenseStates: values.map(state => ({
                      state,
                      licenseNumber: "",
                      expirationDate: null
                    }))
                  }
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}