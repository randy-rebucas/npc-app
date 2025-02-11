"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CertificationSkeleton } from "@/components/skeletons";

const certificationFormSchema = z.object({
    boardCertifications: z.string(),
    additionalCertifications: z.array(z.object({
        certification: z.string().min(1, "Certification is required"),
        issueDate: z.string().min(1, "Issue date is required"),
        expirationDate: z.string().min(1, "Expiration date is required"),
        certificateUrl: z.string().url("Invalid certificate URL"),
        certificateNumber: z.string().min(1, "Certificate number is required"),
    })),
    npiNumber: z.string().min(10, "NPI number must be at least 10 digits"),
});

type CertificationFormValues = z.infer<typeof certificationFormSchema>;

export default function CertificationPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const form = useForm<CertificationFormValues>({
        resolver: zodResolver(certificationFormSchema),
        defaultValues: {
            boardCertifications: "",
            additionalCertifications: [],
            npiNumber: "",
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
                    boardCertifications: profileResponse?.boardCertifications || "",
                    additionalCertifications: profileResponse?.additionalCertifications || [],
                    npiNumber: profileResponse?.npiNumber || "",
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

    async function onSubmit(data: CertificationFormValues) {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    additionalCertifications: data.additionalCertifications,
                    npiNumber: data.npiNumber,
                    boardCertification: data.boardCertifications
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text() || "Failed to update certifications");
            }

            toast({
                title: "Success!",
                description: "Your certifications have been updated.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update certifications",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return <CertificationSkeleton />;
    }

    return (
        <div className="bg-background max-w-2xl mx-auto p-6">
            {/* Header Section */}
            <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground">Certifications</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Please provide your certification details for verification
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
                {/* Primary Information Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">
                            Board Certifications
                        </label>
                        <input
                            {...form.register("boardCertifications")}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                     focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            placeholder="Enter your board certifications"
                        />
                        {form.formState.errors.boardCertifications && (
                            <p className="text-sm text-destructive">{form.formState.errors.boardCertifications.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">NPI Number</label>
                        <div className="relative">
                            <input
                                {...form.register("npiNumber")}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                         focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                placeholder="Enter your 10-digit NPI number"
                            />
                            <p className="absolute -bottom-5 text-xs text-muted-foreground">
                                Please don&apos;t modify after approval
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Certifications Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground">Additional Certifications</label>
                        <button
                            type="button"
                            onClick={() => {
                                form.setValue("additionalCertifications", [
                                    ...form.getValues("additionalCertifications"),
                                    {
                                        certification: "",
                                        issueDate: new Date().toISOString().split('T')[0],
                                        expirationDate: new Date().toISOString().split('T')[0],
                                        certificateUrl: "",
                                        certificateNumber: "",
                                    },
                                ]);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:text-primary/80 
                                     hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Certification
                        </button>
                    </div>

                    <div className="space-y-4">
                        {form.watch("additionalCertifications").map((_, index) => (
                            <div key={index} className="p-6 bg-card rounded-xl border border-border relative 
                                                      hover:border-primary/50 transition-colors">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const currentFields = [...form.getValues("additionalCertifications")];
                                        currentFields.splice(index, 1);
                                        form.setValue("additionalCertifications", currentFields);
                                    }}
                                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-muted transition-colors"
                                >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>

                                <div className="space-y-4">
                                    <input
                                        {...form.register(`additionalCertifications.${index}.certification`)}
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                                 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        placeholder="Certification Name"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-muted-foreground">Issue Date</label>
                                            <input
                                                type="date"
                                                {...form.register(`additionalCertifications.${index}.issueDate`)}
                                                className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                                         focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-muted-foreground">Expiration Date</label>
                                            <input
                                                type="date"
                                                {...form.register(`additionalCertifications.${index}.expirationDate`)}
                                                className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                                         focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            {...form.register(`additionalCertifications.${index}.certificateNumber`)}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                                     focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                            placeholder="Certificate Number"
                                        />
                                        <input
                                            {...form.register(`additionalCertifications.${index}.certificateUrl`)}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg 
                                                     focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                            placeholder="Certificate URL"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg 
                                 hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
