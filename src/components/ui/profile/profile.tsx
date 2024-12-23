'use client';

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react";
import { IUserProfile } from "@/app/models/UserProfile";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().regex(
    /^\+?[1-9]\d{1,14}$/, 
    "Please enter a valid international phone number (e.g. +12125551234)"
  ),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
})

export default function Profile({ profile }: { profile: Partial<IUserProfile> }) {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            state: profile.state || '',
            zip: profile.zip || '',
        }
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="text-sm text-gray-500">
                    Please make sure your information is up to date.
                </p>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Section */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input
                            {...form.register("firstName")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="First name"
                        />
                        {form.formState.errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                            {...form.register("lastName")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Last name"
                        />
                        {form.formState.errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Phone Section */}
                <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <p className="text-sm text-gray-500 mb-1">Please include country code (e.g. +1 for US/Canada)</p>
                    <input
                        {...form.register("phone")}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. +12125551234"
                    />
                    {form.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                    )}
                </div>

                {/* Address Section */}
                <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                        {...form.register("address")}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            {...form.register("city")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="City"
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            {...form.register("state")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="State"
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            {...form.register("zip")}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ZIP"
                        />
                    </div>
                </div>

                {/* Email Section */}
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="flex items-center gap-4">
                        <input
                            defaultValue={session?.user?.email}
                            readOnly
                            className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                        />
                        <button
                            type="button"
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Change Email Address
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}