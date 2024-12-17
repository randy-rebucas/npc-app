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
import Image from 'next/image';
import { OnboardingFormData } from '@/lib/types/onboarding';
import { UseFormReturn } from 'react-hook-form';
import { useOnBoardingStore } from '@/lib/store/onBoardingStore';


interface FormStepProps {
  form: UseFormReturn<OnboardingFormData>
}

export default function ProfilePhotoForm({ form }: FormStepProps) {
  const [previewUrl, setPreviewUrl] = useState<File | null>(form.getValues('profilePhotoUrl') || null);

  const updateFields = useOnBoardingStore(state => state.updateFields);
  // const onBoarding = useOnBoardingStore(state => state.onBoarding);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      // Here you would typically upload the file to your storage service
      // For now, we'll just create a local URL
      setPreviewUrl(file);
      updateFields({ profilePhotoUrl: file });
    }
  };

  return (

    <FormField
      control={form.control}
      name="profilePhotoUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profile Photo</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
                name={field.name}
                onBlur={field.onBlur}
                ref={field.ref}
              />
              {previewUrl && (
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={URL.createObjectURL(previewUrl)}
                    alt="Profile preview"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}