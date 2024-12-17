'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { OnboardingFormData } from '@/lib/types/onboarding';
import { UseFormReturn } from 'react-hook-form';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';

interface FormStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export default function GovernmentIdForm({ form }: FormStepProps) {
  const [fileName, setFileName] = useState<string>(form.getValues('governmentIdUrl') || '');

  const updateFields = useOnBoardingStore(state => state.updateFields);
  // const onBoarding = useOnBoardingStore(state => state.onBoarding);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your storage service
      // For now, we'll just store the file name
      const url = URL.createObjectURL(file);
      setFileName(file.name);
      updateFields({ governmentIdUrl: url });
    }
  };

  return (

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
                accept="image/*"
                className="cursor-pointer"
                onChange={handleFileChange}
                name={field.name}
                onBlur={field.onBlur}
                ref={field.ref}
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

  );
}