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
      try {
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

        // Update form and state with the new URL
        setPreviewUrl(file);
        updateFields({ profilePhotoUrl: file, profilePhotoPath: data.url });
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error appropriately
      }
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="profilePhotoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Photo</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
                name={field.name}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage >{previewUrl ? "Uploaded" : "Upload a profile photo"}</FormMessage>
          </FormItem>
        )}
      />

      {previewUrl && (<FormField
        control={form.control}
        name="profilePhotoPath"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preview Photo</FormLabel>
            <FormControl>
              <Input type="hidden" value={field.value} />
            </FormControl>

            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={URL.createObjectURL(previewUrl)}
                alt="Profile preview"
                fill
                className="rounded-full object-cover"
              />
            </div>

          </FormItem>
        )}
      />)}
    </>
  );
}