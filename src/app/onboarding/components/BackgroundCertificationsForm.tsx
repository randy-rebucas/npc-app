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
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { OnboardingFormData } from '@/lib/types/onboarding';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';

interface FormStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export default function BackgroundCertificationsForm({
  form
}: FormStepProps) {
  const updateFields = useOnBoardingStore(state => state.updateFields);
  const onBoarding = useOnBoardingStore(state => state.onBoarding);

  return (
    <>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe your professional background and experience..."
                value={onBoarding.description}
                onChange={(e) => updateFields({ description: e.target.value })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="boardCertification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Board Certification</FormLabel>
            <FormControl>
              <Input {...field} value={onBoarding.boardCertification} onChange={(e) => updateFields({ boardCertification: e.target.value })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalCertifications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Certifications</FormLabel>
            <FormControl>
              <MultiSelect
                {...field}
                options={[
                  { label: 'BLS', value: 'BLS' },
                  { label: 'ACLS', value: 'ACLS' },
                  { label: 'PALS', value: 'PALS' },
                  // Add more certification options as needed
                ]}
                value={onBoarding.additionalCertifications.map(cert => cert.certification)}
                onValueChange={(value) => updateFields({
                  additionalCertifications: value.map(cert => ({
                    certification: cert,
                    issueDate: null,
                    expirationDate: null,
                    certificateUrl: null,
                    certificateNumber: "",
                  }))
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="linkedinProfile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://linkedin.com/in/..." value={onBoarding.linkedinProfile} onChange={(e) => updateFields({ linkedinProfile: e.target.value })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}