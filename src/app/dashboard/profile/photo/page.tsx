'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import * as z from 'zod';
import Image from 'next/image';
import { PhotoSkeleton } from '@/components/skeletons';

const formSchema = z.object({
    photo: z.instanceof(File).optional(),
})

export default function Photo() {
    const [photoUrl, setPhotoUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // Memoize the setValue function
    const setValue = form.setValue;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const userProfile = await fetch(`/api/profile`);

                if (!userProfile.ok) {
                    throw new Error(`Failed to fetch profile: ${userProfile.statusText}`);
                }
                const profileResponse = await userProfile.json();
                setPhotoUrl(profileResponse?.profilePhotoPath || '');

                const profile = {
                    photo: profileResponse?.profilePhotoPath || '',
                };

                Object.entries(profile).forEach(([key, value]) => {
                    setValue(key as keyof typeof profile, value);
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: `Failed to load profile data: ${error}`,
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserProfile();

    }, [setValue, toast]);

    if (isLoading) {
        return <PhotoSkeleton />; 
    }
    

    const handleUpload = async (file: File) => {
        setIsUploading(true);

        try {
            // Delete old file
            const deleteResponse = await fetch("/api/upload", {
                method: "DELETE",
                body: JSON.stringify({ path: photoUrl }),
            });

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete old file");
            }

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

            setPhotoUrl(data.url);

            if (data.url) {

                // Update profile photo path
                await fetch("/api/profile", {
                    method: "POST",
                    body: JSON.stringify({ profilePhotoPath: data.url }),
                });

                toast({
                    title: "Success!",
                    description: "Your profile has been updated.",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to upload file. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to upload file. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Picture</h2>
                <p className="text-sm text-gray-500">
                    Please make sure your information is up to date.
                </p>
            </div>

            <div className="flex flex-col items-center gap-6">
                {/* Profile Image */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                    {(photoUrl) ? (
                        <Image
                            src={photoUrl || ''}
                            alt='avatar'
                            className="w-full h-full object-cover"
                            width={128}
                            height={128}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                            {''}
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div className="relative">
                    <input
                        type="file"
                        className="hidden"
                        id="profile-upload"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                form.setValue('photo', file);
                                handleUpload(file);
                            }
                        }}
                    />
                    <button
                        onClick={() => document.getElementById("profile-upload")?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 
                                 transition-colors text-gray-700 font-medium disabled:opacity-50"
                    >
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                </div>


            </div>
        </div>
    );
}