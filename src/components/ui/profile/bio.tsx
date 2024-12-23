'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IUserProfile } from "@/app/models/UserProfile";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const bioFormSchema = z.object({
    description: z.string().min(1, "Background is required"),
    boardCertification: z.string().min(1, "Board certifications are required"),
    linkedinProfile: z.string().url().optional().or(z.literal("")),
});

type BioFormValues = z.infer<typeof bioFormSchema>;

export default function Bio({ bio }: { bio: Partial<IUserProfile> }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<BioFormValues>({
        resolver: zodResolver(bioFormSchema),
        defaultValues: {
            description: bio.description || '',
            boardCertification: bio.boardCertification || '',
            linkedinProfile: bio.linkedinProfile || '',
        },
    });

    async function onSubmit(data: BioFormValues) {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            toast({
                title: "Success!",
                description: "Your profile has been updated.",
                variant: "default",
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Bio</h2>
                <p className="text-sm text-gray-600 mt-1">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician after our matching process.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Your Background:
                    </label>
                    <textarea
                        {...form.register("description")}
                        className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Tell us about your medical background and experience..."
                    />
                    {form.formState.errors.description && (
                        <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Board Certifications:
                    </label>
                    <input
                        {...form.register("boardCertification")}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., American Board of Internal Medicine (ABIM)"
                    />
                    {form.formState.errors.boardCertification && (
                        <p className="text-sm text-red-500">{form.formState.errors.boardCertification.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        LinkedIn Profile:
                    </label>
                    <input
                        type="url"
                        {...form.register("linkedinProfile")}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/your-profile"
                    />
                    {form.formState.errors.linkedinProfile && (
                        <p className="text-sm text-red-500">{form.formState.errors.linkedinProfile.message}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>

        </div>
    );
}
