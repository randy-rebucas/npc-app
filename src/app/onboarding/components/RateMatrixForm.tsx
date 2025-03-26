
'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';
import { OnboardingFormData } from '@/lib/types/onboarding';
import { UseFormReturn } from 'react-hook-form';

interface FormStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export default function RateMatrixForm({ form }: FormStepProps) {

  const updateFields = useOnBoardingStore(state => state.updateFields);
  const onBoarding = useOnBoardingStore(state => state.onBoarding);

  return (
    <div className='flex flex-col gap-2'>
      <FormField
        control={form.control}
        name="rateMatrix.monthlyCollaborationRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Base Collaboration Rate ($)</FormLabel>
            <FormControl>
              <Input type="number" {...field} value={onBoarding.rateMatrix.monthlyCollaborationRate} onChange={e => updateFields({ rateMatrix: { ...onBoarding.rateMatrix, monthlyCollaborationRate: parseFloat(e.target.value) } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rateMatrix.additionalStateFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional State Fee ($)</FormLabel>
            <FormControl>
              <Input type="number" {...field} value={onBoarding.rateMatrix.additionalStateFee} onChange={e => updateFields({ rateMatrix: { ...onBoarding.rateMatrix, additionalStateFee: parseFloat(e.target.value) } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rateMatrix.additionalNPFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Nurse Practitioner Fee ($)</FormLabel>
            <FormControl>
              <Input type="number" {...field} value={onBoarding.rateMatrix.additionalNPFee} onChange={e => updateFields({ rateMatrix: { ...onBoarding.rateMatrix, additionalNPFee: parseFloat(e.target.value) } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rateMatrix.controlledSubstancesMonthlyFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Controlled Substances Monthly Fee ($)</FormLabel>
            <FormControl>
              <Input type="number" {...field} value={onBoarding.rateMatrix.controlledSubstancesMonthlyFee} onChange={e => updateFields({ rateMatrix: { ...onBoarding.rateMatrix, controlledSubstancesMonthlyFee: parseFloat(e.target.value) } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}