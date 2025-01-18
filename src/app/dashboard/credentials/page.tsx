'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { CredentialsSkeleton } from "@/components/skeletons"

// Add form schema
const licenseSchema = z.object({
    medicalLicenseStates: z.array(z.object({
        state: z.string().min(1, "State is required"),
        licenseNumber: z.string().min(1, "License number is required"),
        expirationDate: z.string().min(1, "Expiration date is required")
            .transform((date) => new Date(date))
            .refine((date) => date > new Date(), {
                message: "Expiration date must be in the future"
            })
    })),
    deaLicenseStates: z.array(z.object({
        state: z.string().min(1, "State is required"),
        licenseNumber: z.string().min(1, "License number is required"),
        expirationDate: z.string().min(1, "Expiration date is required")
            .transform((date) => new Date(date))
            .refine((date) => date > new Date(), {
                message: "Expiration date must be in the future"
            })
    }))
})

export default function CredentialsPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [states, setStates] = useState([]);

    // Update the form initialization
    const form = useForm<z.infer<typeof licenseSchema>>({
        resolver: zodResolver(licenseSchema),
        defaultValues: {
            medicalLicenseStates: [],
            deaLicenseStates: []
        }
    })

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
                    medicalLicenseStates: profileResponse?.medicalLicenseStates || [],
                    deaLicenseStates: profileResponse?.deaLicenseStates || [],
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

    useEffect(() => {
        const fetchStates = async () => {
            const states = await fetch(`/api/states`);
            const statesData = await states.json();
            setStates(statesData);
        }
        fetchStates();
    }, [isLoading]);

    // Update the submit function
    async function onSubmit(values: z.infer<typeof licenseSchema>) {
        setIsSubmitting(true);
        try {
            const formattedData = {
                medicalLicenseStates: values.medicalLicenseStates.map(license => ({
                    ...license,
                    expirationDate: new Date(license.expirationDate).toISOString(),
                })),
                deaLicenseStates: values.deaLicenseStates.map(license => ({
                    ...license,
                    expirationDate: new Date(license.expirationDate).toISOString(),
                }))
            };

            const response = await fetch("/api/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            toast({
                title: "Success!",
                description: "Your licenses have been updated.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update licenses",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <CredentialsSkeleton /> 
    }

    return (
        <div className="bg-white max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">License Information</h2>
                <p className="text-gray-600 mt-2">
                    License verification is checked prior to all collaboration initiations.
                </p>
                <p className="text-gray-600 mt-2">
                    <span className="font-medium">NP Collaborator</span> is currently serving{" "}
                    <span className="font-medium">NJ, MI, OH, TX</span>
                </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">

                {/* Medical Licenses Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Medical Licenses
                        <span className="block text-sm text-gray-500 font-normal">
                            Required for all NP Collaborators
                        </span>
                    </h3>

                    {form.watch("medicalLicenseStates").map((license, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex gap-4 items-center items-start">
                                <div className="flex-1">
                                    <select
                                        {...form.register(`medicalLicenseStates.${index}.state`)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select State</option>
                                        {states.map(state => {
                                            // Check if state is already selected in another medical license
                                            const isStateSelected = form.watch("medicalLicenseStates")
                                                .some((l, i) => i !== index && l.state === state);
                                            return (
                                                <option 
                                                    key={state} 
                                                    value={state} 
                                                    disabled={isStateSelected}
                                                >
                                                    {state} {isStateSelected ? '(Already Selected)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {form.formState.errors.medicalLicenseStates?.[index]?.state && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {form.formState.errors.medicalLicenseStates[index]?.state?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="text"
                                        {...form.register(`medicalLicenseStates.${index}.licenseNumber`)}
                                        placeholder="License number"
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="date"
                                        {...form.register(`medicalLicenseStates.${index}.expirationDate`)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {form.watch("medicalLicenseStates").length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentLicenses = form.getValues("medicalLicenseStates");
                                            form.setValue(
                                                "medicalLicenseStates",
                                                currentLicenses.filter((_, i) => i !== index)
                                            );
                                        }}
                                        className="p-2 text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4 text-gray-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            const currentLicenses = form.getValues("medicalLicenseStates");
                            form.setValue("medicalLicenseStates", [
                                ...currentLicenses,
                                { state: "", licenseNumber: "", expirationDate: new Date() }
                            ]);
                        }}
                        className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        + Add New License
                    </button>
                </div>

                <hr className="my-8" />

                {/* DEA Licenses Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        DEA Licenses
                        <span className="block text-sm text-gray-500 font-normal">
                            Required for prescribing controlled substances
                        </span>
                    </h3>

                    {form.watch("deaLicenseStates").map((license, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex gap-4 items-center items-start">
                                <div className="flex-1">
                                    <select
                                        {...form.register(`deaLicenseStates.${index}.state`)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select State</option>
                                        {states.map(state => {
                                            // Check if state is already selected in another DEA license
                                            const isStateSelected = form.watch("deaLicenseStates")
                                                .some((l, i) => i !== index && l.state === state);
                                            return (
                                                <option 
                                                    key={state} 
                                                    value={state} 
                                                    disabled={isStateSelected}
                                                >
                                                    {state} {isStateSelected ? '(Already Selected)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {form.formState.errors.deaLicenseStates?.[index]?.state && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {form.formState.errors.deaLicenseStates[index]?.state?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="text"
                                        {...form.register(`deaLicenseStates.${index}.licenseNumber`)}
                                        placeholder="DEA License number"
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="date"
                                        {...form.register(`deaLicenseStates.${index}.expirationDate`)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {form.watch("deaLicenseStates").length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentLicenses = form.getValues("deaLicenseStates");
                                            form.setValue(
                                                "deaLicenseStates",
                                                currentLicenses.filter((_, i) => i !== index)
                                            );
                                        }}
                                        className="p-2 text-red-500 hover:text-red-700"
                                    >
                                        <X className="h-4 w-4 text-gray-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            const currentLicenses = form.getValues("deaLicenseStates");
                            form.setValue("deaLicenseStates", [
                                ...currentLicenses,
                                { state: "", licenseNumber: "", expirationDate: new Date() }
                            ]);
                        }}
                        className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        + Add New DEA License
                    </button>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>

            </form>
        </div>
    )
}