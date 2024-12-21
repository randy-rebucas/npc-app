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
  const [fileName, setFileName] = useState<File | null>(form.getValues('governmentIdUrl') || null);

  const updateFields = useOnBoardingStore(state => state.updateFields);
  // const onBoarding = useOnBoardingStore(state => state.onBoarding);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create FormData object
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFileName(file);
      updateFields({ governmentIdUrl: file, governmentIdPath: data.url });
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="governmentIdUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Government Issued ID</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                className="cursor-pointer"
                onChange={handleFileChange}
                name={field.name}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage >{fileName ? "Uploaded" : "Upload a government ID"}</FormMessage>
          </FormItem>
        )}
      />
      {fileName && <FormField
        control={form.control}
        name="governmentIdPath"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Government ID Path</FormLabel>
            <FormControl>
              <Input type="hidden" value={field.value} />
            </FormControl>
            {fileName && (
              <p className="text-sm text-muted-foreground">
                Uploaded: {URL.createObjectURL(fileName)}
              </p>
            )}
          </FormItem>
        )}
      />}
    </>
  );
}