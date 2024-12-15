// src/app/onboarding/components/ProfilePhotoForm.tsx
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
import Image from 'next/image';
import { OnboardingFormData } from '@/lib/types/onboarding';

const formSchema = z.object({
  profilePhotoUrl: z.string().min(1, 'Profile photo is required'),
});

interface ProfilePhotoFormProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
}

export default function ProfilePhotoForm({
  data,
  updateData,
}: ProfilePhotoFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(data.profilePhotoUrl || '');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profilePhotoUrl: data.profilePhotoUrl || '',
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload the file to your storage service
      // For now, we'll just create a local URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('profilePhotoUrl', url);
      updateData({ profilePhotoUrl: url });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
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
      </form>
    </Form>
  );
}