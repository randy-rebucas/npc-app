
'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { OnboardingFormData } from '@/lib/types/onboarding';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';

const practiceTypes = [
  'Primary Care',
  'Urgent Care',
  'Emergency Care',
  'Telemedicine',
  'Internal Medicine',
  'Family Medicine',
  'Pediatrics',
  'Psychiatry',
];

interface FormStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export default function ClinicalPracticeForm({ form }: FormStepProps) {

  const updateFields = useOnBoardingStore(state => state.updateFields);
  const onBoarding = useOnBoardingStore(state => state.onBoarding);

  return (
    <div className='flex flex-col gap-2'>
      <FormField
        control={form.control}
        name="practiceTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Clinical Practice Types</FormLabel>
            <FormControl>
              <MultiSelect
                {...field}
                options={practiceTypes.map(type => ({
                  label: type,
                  value: type,
                }))}
                value={onBoarding.practiceTypes}
                onValueChange={(value) => updateFields({ practiceTypes: value })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="npiNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NPI Number</FormLabel>
            <FormControl>
              <Input {...field} value={onBoarding.npiNumber} onChange={(e) => updateFields({ npiNumber: e.target.value })} /> 
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}