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
    <div className='flex flex-col gap-2'>
      <FormField
        control={form.control}
        name="profile.firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input {...field} value={onBoarding.profile.firstName} onChange={(e) => updateFields({ profile: { ...onBoarding.profile, firstName: e.target.value } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="profile.lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input {...field} value={onBoarding.profile.lastName} onChange={(e) => updateFields({ profile: { ...onBoarding.profile, lastName: e.target.value } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="profile.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone number</FormLabel>
            <FormControl>
              <Input {...field} value={onBoarding.profile.phone} onChange={(e) => updateFields({ profile: { ...onBoarding.profile, phone: e.target.value } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="profile.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" value={onBoarding.profile.email} onChange={(e) => updateFields({ profile: { ...onBoarding.profile, email: e.target.value } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}