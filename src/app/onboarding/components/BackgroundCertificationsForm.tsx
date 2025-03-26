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
    <div className='flex flex-col gap-2'>
      <FormField
        control={form.control}
        name="backgroundCertification.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe your professional background and experience..."
                value={onBoarding.backgroundCertification.description}
                onChange={(e) => updateFields({ backgroundCertification: { ...onBoarding.backgroundCertification, description: e.target.value } })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="backgroundCertification.boardCertification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Board Certification</FormLabel>
            <FormControl>
              <Input {...field} value={onBoarding.backgroundCertification.boardCertification} onChange={(e) => updateFields({ backgroundCertification: { ...onBoarding.backgroundCertification, boardCertification: e.target.value } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="backgroundCertification.additionalCertifications"
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
                value={onBoarding.backgroundCertification.additionalCertifications.map(cert => cert.certification)}
                onValueChange={(value) => updateFields({
                  backgroundCertification: {
                    ...onBoarding.backgroundCertification,
                    additionalCertifications: value.map(cert => ({
                      certification: cert,
                      issueDate: new Date(),
                      expirationDate: new Date(),
                      certificateUrl: "",
                      certificateNumber: "",
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
        name="backgroundCertification.linkedinProfile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://linkedin.com/in/..." value={onBoarding.backgroundCertification.linkedinProfile} onChange={(e) => updateFields({ backgroundCertification: { ...onBoarding.backgroundCertification, linkedinProfile: e.target.value } })} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}