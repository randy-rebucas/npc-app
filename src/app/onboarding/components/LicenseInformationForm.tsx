// src/app/onboarding/components/LicenseInformationForm.tsx
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
import { MultiSelect } from '@/components/ui/multi-select';
import { OnboardingFormData } from '@/lib/types/onboarding';

const medicalLicenseStates = [
  'California', 'New York', 'Texas', 'Florida', 'Illinois',
  // Add more states as needed
];

const deaLicenseStates = [
  'California', 'New York', 'Texas', 'Florida', 'Illinois',
  // Add more states as needed
];

const formSchema = z.object({
  medicalLicenseStates: z.array(z.string()).min(1, 'Select at least one state'),
  deaLicenseStates: z.array(z.string()).min(1, 'Select at least one state'),
});

interface LicenseInformationFormProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
  currentStep: number;
}

export default function LicenseInformationForm({ data, updateData, currentStep }: LicenseInformationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalLicenseStates: data.medicalLicenseStates || [],
      deaLicenseStates: data.deaLicenseStates || [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {

    fetch(`/api/onboarding/${currentStep}`, {
      method: 'POST',
      body: JSON.stringify(values),
    }).then(response => {
      updateData(values);
      return response.json();
    }).catch(error => console.error(error));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="medicalLicenseStates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>States with Medical License</FormLabel>
              <FormControl>
                <MultiSelect
                  options={medicalLicenseStates.map(state => ({
                    label: state,
                    value: state,
                  }))}
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
          name="deaLicenseStates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>States with DEA License</FormLabel>
              <FormControl>
                <MultiSelect
                  options={deaLicenseStates.map(state => ({
                    label: state,
                    value: state,
                  }))}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}