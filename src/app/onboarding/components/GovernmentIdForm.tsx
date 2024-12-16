'use client';

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
import { UseFormReturn } from 'react-hook-form';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';

interface FormStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export default function GovernmentIdForm({ form }: FormStepProps) {
  const [fileName, setFileName] = useState<string>('');

  const updateFields = useOnBoardingStore(state => state.updateFields); 
  const onBoarding = useOnBoardingStore(state => state.onBoarding);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your storage service
      // For now, we'll just store the file name
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      updateFields({ governmentIdUrl: url });
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
                    value={onBoarding.governmentIdUrl}
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