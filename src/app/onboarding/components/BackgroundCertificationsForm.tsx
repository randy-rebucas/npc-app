// src/app/onboarding/components/BackgroundCertificationsForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
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

const formSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  boardCertification: z.string().min(1, 'Board certification is required'),
  additionalCertifications: z.array(z.string()),
  linkedinProfile: z.string().url('Must be a valid LinkedIn URL'),
});

interface FormStepProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>, isValid?: boolean) => void;
  currentStep: number;
  setIsValid: (isValid: boolean) => void;
}

export default function BackgroundCertificationsForm({
  data,
  updateData,
  currentStep,
}: FormStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: data.description || '',
      boardCertification: data.boardCertification || '',
      additionalCertifications: data.additionalCertifications || [],
      linkedinProfile: data.linkedinProfile || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    fetch(`/api/onboarding/${currentStep}`, {
      method: 'POST',
      body: JSON.stringify(values),
    }).then(response => {
      console.log(response);
      updateData(values);
      return response.json();
    }).catch(error => console.error(error));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Input {...field} />
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
                  options={[
                    { label: 'BLS', value: 'BLS' },
                    { label: 'ACLS', value: 'ACLS' },
                    { label: 'PALS', value: 'PALS' },
                    // Add more certification options as needed
                  ]}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
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
                <Input {...field} placeholder="https://linkedin.com/in/..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}