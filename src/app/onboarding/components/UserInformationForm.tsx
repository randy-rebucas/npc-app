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
import { useEffect } from 'react';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

interface FormStepProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>, isValid?: boolean) => void;
  currentStep: number;
  setIsValid: (isValid: boolean) => void;
}

export default function UserInformationForm({ data, updateData, currentStep, setIsValid }: FormStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
    },
  });

  useEffect(() => {
    const isValid = data.firstName && data.lastName && data.email;
    setIsValid(!!isValid);
  }, [data, setIsValid]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {

    fetch(`http://localhost:3000/api/onboarding/${currentStep}`, {
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
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
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
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}