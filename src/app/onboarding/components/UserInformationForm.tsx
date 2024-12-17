'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OnboardingFormData } from '@/lib/types/onboarding';
import { UseFormReturn } from 'react-hook-form';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';
interface FormStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export default function UserInformationForm({ form }: FormStepProps) {

  const updateFields = useOnBoardingStore(state => state.updateFields);
  const onBoarding = useOnBoardingStore(state => state.onBoarding);

  return (
    <>
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input {...field} value={onBoarding.firstName} onChange={(e) => updateFields({ firstName: e.target.value })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input {...field} value={onBoarding.lastName} onChange={(e) => updateFields({ lastName: e.target.value })}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" value={onBoarding.email} onChange={(e) => updateFields({ email: e.target.value })} readOnly/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}