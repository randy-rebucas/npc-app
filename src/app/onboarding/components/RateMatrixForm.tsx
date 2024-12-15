// src/app/onboarding/components/RateMatrixForm.tsx
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
import { OnboardingFormData } from '@/lib/types/onboarding';

const formSchema = z.object({
  monthlyCollaborationRate: z.number().min(0),
  additionalStateFee: z.number().min(0),
  additionalNPFee: z.number().min(0),
  controlledSubstancesMonthlyFee: z.number().min(0),
  controlledSubstancesPerPrescriptionFee: z.number().min(0),
});

interface RateMatrixFormProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
  currentStep: number;
}

export default function RateMatrixForm({ data, updateData, currentStep }: RateMatrixFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyCollaborationRate: data.monthlyCollaborationRate || 0,
      additionalStateFee: data.additionalStateFee || 0,
      additionalNPFee: data.additionalNPFee || 0,
      controlledSubstancesMonthlyFee: data.controlledSubstancesMonthlyFee || 0,
      controlledSubstancesPerPrescriptionFee: data.controlledSubstancesPerPrescriptionFee || 0,
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
          name="monthlyCollaborationRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Base Collaboration Rate ($)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalStateFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional State Fee ($)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalNPFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Nurse Practitioner Fee ($)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="controlledSubstancesMonthlyFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Controlled Substances Monthly Fee ($)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="controlledSubstancesPerPrescriptionFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Controlled Substances Per Prescription Fee ($)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}