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
  const [previewUrl, setPreviewUrl] = useState<string>(form.getValues('profilePhotoUrl') || '');

  const updateFields = useOnBoardingStore(state => state.updateFields);
  const onBoarding = useOnBoardingStore(state => state.onBoarding);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your storage service
      // For now, we'll just create a local URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      updateFields({ profilePhotoUrl: url });
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
                {...field}
                value={onBoarding.profilePhotoUrl}
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {previewUrl && (
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={previewUrl}
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