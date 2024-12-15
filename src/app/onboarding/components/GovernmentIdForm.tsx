// src/app/onboarding/components/GovernmentIdForm.tsx
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
import { useState } from 'react';
import { OnboardingFormData } from '@/lib/types/onboarding';

const formSchema = z.object({
  governmentIdUrl: z.string().min(1, 'Government ID is required'),
});

interface GovernmentIdFormProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
  currentStep: number;
}

export default function GovernmentIdForm({
  data,
  updateData,
  currentStep,
}: GovernmentIdFormProps) {
  const [fileName, setFileName] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      governmentIdUrl: data.governmentIdUrl || '',
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your storage service
      // For now, we'll just store the file name
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      fetch(`/api/onboarding/${currentStep}`, {
        method: 'POST',
        body: JSON.stringify({ governmentIdUrl: url }),
      }).then(response => {
        console.log(response);
        form.setValue('governmentIdUrl', url);
        updateData({ governmentIdUrl: url });
        return response.json();
      }).catch(error => console.error(error));
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="governmentIdUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Government Issued ID</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    className="cursor-pointer"
                    {...field}
                    onChange={handleFileChange}
                  />
                  {fileName && (
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {fileName}
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}