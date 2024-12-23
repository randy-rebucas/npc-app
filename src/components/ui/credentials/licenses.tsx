'use client'

import { License } from "@/lib/types/onboarding"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

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

export default function Licenses({ medicalLicenseStates, deaLicenseStates, states }: {
    medicalLicenseStates: License[],
    deaLicenseStates: License[],
    states: string[]
}) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update the form initialization
    const form = useForm<z.infer<typeof licenseSchema>>({
        resolver: zodResolver(licenseSchema),
        defaultValues: {
            medicalLicenseStates: medicalLicenseStates.map(license => ({
                state: license.state,
                licenseNumber: license.licenseNumber,
                expirationDate: license.expirationDate ? new Date(license.expirationDate) : new Date()
            })),
            deaLicenseStates: deaLicenseStates.map(license => ({
                state: license.state,
                licenseNumber: license.licenseNumber,
                expirationDate: license.expirationDate ? new Date(license.expirationDate) : new Date()
            }))
        }
    })

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

    return (
        <div className="p-6 max-w-2xl mx-auto">
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

                    {form.watch("medicalLicenseStates").map((_, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex gap-4 items-center items-start">
                                <div className="flex-1">
                                    <select
                                        {...form.register(`medicalLicenseStates.${index}.state`)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select State</option>
                                        {states.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
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

                    {form.watch("deaLicenseStates").map((_, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex gap-4 items-center items-start">
                                <div className="flex-1">
                                    <select
                                        {...form.register(`deaLicenseStates.${index}.state`)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select State</option>
                                        {states.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
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