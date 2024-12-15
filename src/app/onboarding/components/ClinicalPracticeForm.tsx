// src/app/onboarding/components/ClinicalPracticeForm.tsx
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

const formSchema = z.object({
  practiceTypes: z.array(z.string()).min(1, 'Select at least one practice type'),
});

interface ClinicalPracticeFormProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
}

export default function ClinicalPracticeForm({ data, updateData }: ClinicalPracticeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      practiceTypes: data.practiceTypes || [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateData(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="practiceTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinical Practice Types</FormLabel>
              <FormControl>
                <MultiSelect
                  options={practiceTypes.map(type => ({
                    label: type,
                    value: type,
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