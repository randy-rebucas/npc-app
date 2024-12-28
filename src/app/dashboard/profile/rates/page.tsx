'use client';

import { InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RatesSkeleton } from "@/components/skeletons";

const ratesSchema = z.object({
    monthlyCollaborationRate: z.number().min(0, "Base rate must be positive"),
    additionalStateFee: z.number().min(0, "State rate must be positive"),
    additionalNPFee: z.number().min(0, "NP rate must be positive"),
    controlledSubstancesMonthlyFee: z.number().nullable(),
    controlledSubstancesPerPrescriptionFee: z.number().nullable(),
});

type RatesFormValues = z.infer<typeof ratesSchema>;

export default function Rates() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const form = useForm<RatesFormValues>({
        resolver: zodResolver(ratesSchema),
        defaultValues: {
            monthlyCollaborationRate: 0,
            additionalStateFee: 0,
            additionalNPFee: 0,
            controlledSubstancesMonthlyFee: 0,
            controlledSubstancesPerPrescriptionFee: 0,
        },
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
                    monthlyCollaborationRate: profileResponse?.monthlyCollaborationRate || 0,
                    additionalStateFee: profileResponse?.additionalStateFee || 0,
                    additionalNPFee: profileResponse?.additionalNPFee || 0,
                    controlledSubstancesMonthlyFee: profileResponse?.controlledSubstancesMonthlyFee || 0,
                    controlledSubstancesPerPrescriptionFee: profileResponse?.controlledSubstancesPerPrescriptionFee || 0,
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
        return <RatesSkeleton />;
    }

    const onSubmit = async (data: RatesFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            toast({
                title: "Success!",
                description: "Your profile has been updated.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const InputField = ({ label, name, tooltip }: { label: string; name: keyof RatesFormValues; tooltip: string }) => (
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <div className="relative group">
                    <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg">
                        {tooltip}
                    </div>
                </div>
            </div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                    type="number"
                    {...form.register(name, { valueAsNumber: true })}
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
            </div>
            {form.formState.errors[name] && (
                <p className="mt-1 text-sm text-red-500">{form.formState.errors[name]?.message}</p>
            )}
        </div>
    );

    return (

        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Update Your Rate Matrix</h2>
                <p className="text-gray-600 text-sm">
                    During our matching process, we will quote your base rate plus any additional fees based on your choices below.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                    Please be aware, adjustments in Rates may take 2-3 business days to appear in your profile.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    label="Monthly Base Collaboration Rate"
                    name="monthlyCollaborationRate"
                    tooltip="Base monthly rate for collaboration services"
                />

                <InputField
                    label="Additional State Fee (per state)"
                    name="additionalStateFee"
                    tooltip="Extra fee charged per additional state"
                />

                <InputField
                    label="Additional Nurse Practitioner Fee"
                    name="additionalNPFee"
                    tooltip="Fee for multi-NP practices"
                />

                <InputField
                    label="Controlled Substances Fee (per prescription)"
                    name="controlledSubstancesPerPrescriptionFee"
                    tooltip="Optional fee per controlled substance prescription"
                />

                <InputField
                    label="Controlled Substances Monthly Fee"
                    name="controlledSubstancesMonthlyFee"
                    tooltip="Optional monthly fee for controlled substances"
                />

                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                     disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>

    );
}