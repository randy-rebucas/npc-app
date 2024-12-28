"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { GovidSkeleton } from "@/components/skeletons";

const formSchema = z.object({
  governmentId: z.instanceof(File).optional(),
  governmentIdPath: z.string().optional(),
});

export default function GovidPage() {
    const [govIdUrl, setGovIdUrl] = useState('');
    const [currentGovId, setCurrentGovId] = useState<{ governmentIdPath: string }>({ governmentIdPath: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
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

                const profile = {
                    governmentIdPath: profileResponse?.governmentIdPath || "",
                };

                setCurrentGovId(profile);
                setValue('governmentIdPath', profile.governmentIdPath);
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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setIsSubmitting(true);

        try {
            // Only delete if there's an existing path and a new file
            if (currentGovId.governmentIdPath && values.governmentId) {
                const deleteResponse = await fetch("/api/upload", {
                    method: "DELETE",
                    body: JSON.stringify({ path: currentGovId.governmentIdPath }),
                });

                if (!deleteResponse.ok) {
                    throw new Error("Failed to delete old file");
                }
            }

            // Only upload if there's a new file
            if (values.governmentId) {
                // Create FormData object
                const formData = new FormData();
                formData.append('file', values.governmentId as File);

                // Upload file to server
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }
                const data = await response.json();
                console.log(data);
                setGovIdUrl(data.url);

                if (data.url) {

                    // Update profile photo path
                    await fetch("/api/profile", {
                        method: "POST",
                        body: JSON.stringify({ governmentIdPath: data.url }),
                    });

                    toast({
                        title: "Success!",
                        description: "Your government ID has been updated.",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to upload file. Please try again.",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to upload file. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <GovidSkeleton />; 
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Government ID</h2>
                <p className="text-gray-600 mt-1">
                    Your record of upload of your Government Issue ID.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Upload Government ID
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => form.setValue('governmentId', e.target.files?.[0])}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer"
                        />
                    </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm 
                        ${currentGovId.governmentIdPath 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-700'}`}>
                        {currentGovId.governmentIdPath ? 'Document Uploaded' : 'No Document'}
                    </span>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg
                            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                            transition duration-150 ease-in-out"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {(govIdUrl || currentGovId.governmentIdPath) && (
                    <p className="text-sm text-gray-500">
                        Uploaded: {govIdUrl || currentGovId.governmentIdPath}
                    </p>
                )}
            </form>

        </div>
    );
}
