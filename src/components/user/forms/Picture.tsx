'use client'

import { IUser } from '@/app/models/User';
import { IUserProfile } from '@/app/models/UserProfile';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Picture({ profile }: { profile: IUserProfile & { user: IUser } }) { 
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.profilePhotoPath);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Error',
                description: 'Please upload an image file',
                variant: 'destructive',
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({
                title: 'Error',
                description: 'Image must be less than 5MB',
                variant: 'destructive',
            });
            return;
        }

        // Clean up previous preview URL if it exists
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        // Create new preview URL
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);

        // Upload avatar
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Upload file to server
            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            const uploadData = await uploadResponse.json();

            const avatarResponse = await fetch('/api/profile/avatar', {
                method: 'POST',
                body: JSON.stringify({ profilePhotoPath: uploadData.url }),
            });

            const avatarData = await avatarResponse.json();
            console.log(avatarData);
            toast({
                title: 'Success',
                description: 'Avatar updated successfully!',
                variant: 'default',
            });
        } catch (error) {
            // Clean up preview URL on error
            URL.revokeObjectURL(newPreviewUrl);
            setPreviewUrl(null);
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to upload avatar',
                variant: 'destructive',
            });
        }
    };

    // Clean up object URL when component unmounts or when previewUrl changes
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="space-y-4 mb-4">
            <label className="block text-sm font-medium text-gray-700">
                Profile Picture
            </label>
            <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                    {previewUrl && (
                        <Image
                            src={previewUrl}
                            alt="Profile preview"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-gray-700">Change Photo</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    )
}