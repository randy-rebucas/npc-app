"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export type Education = {
    undergrad?: string;
    medical?: string;
    residency?: string;
}

const educationFormSchema = z.object({
    clinicalDegree: z.string().min(2, "Clinical degree is required"),
    practiceTypes: z.array(z.string()),
    education: z.object({
        undergrad: z.string().min(2, "Undergraduate institution is required"),
        medical: z.string().min(2, "Medical school is required"),
        residency: z.string().min(2, "Residency program is required"),
    }),
})

type EducationFormValues = z.infer<typeof educationFormSchema>;

export default function Education({
    education = { undergrad: '', medical: '', residency: '' },
    clinicalDegree = '',
    practiceTypes = [],
    practices = []
}: {
    education?: Education,
    clinicalDegree?: string,
    practiceTypes?: string[],
    practices: string[]
}) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<EducationFormValues>({
        resolver: zodResolver(educationFormSchema),
        defaultValues: {
            clinicalDegree: clinicalDegree || "",
            practiceTypes: practiceTypes || [],
            education: {
                undergrad: education.undergrad || "",
                medical: education.medical || "",
                residency: education.residency || "",
            },
        },
    })

    async function onSubmit(data: EducationFormValues) {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                body: JSON.stringify({
                    clinicalDegree: data.clinicalDegree,
                    education: data.education,
                    practiceTypes: data.practiceTypes
                }),
            });

            if (!response.ok) throw new Error("Failed to update education");

            toast({
                title: "Success!",
                description: "Your education has been updated.",
            });

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update education",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Degree</h2>
                <p className="text-gray-600 mt-2">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Clinical Degree Field */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Clinical Degree Type
                    </label>
                    <input
                        type="text"
                        {...form.register("clinicalDegree")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MD"
                    />
                </div>

                {/* Practice Types Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Practice Types</h3>
                    <div className="flex flex-wrap gap-2">
                        {form.watch("practiceTypes").map((type) => (
                            <span key={type} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                {type}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newTypes = form.getValues("practiceTypes").filter(t => t !== type);
                                        form.setValue("practiceTypes", newTypes);
                                    }}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >×</button>
                            </span>
                        ))}
                    </div>
                    <select
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value && !form.getValues("practiceTypes").includes(value)) {
                                form.setValue("practiceTypes", [...form.getValues("practiceTypes"), value]);
                            }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select practice types</option>
                        {practices
                            .filter(practice => !form.watch("practiceTypes").includes(practice))
                            .map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))
                        }
                    </select>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Education Fields */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                    {(['undergrad', 'medical', 'residency'] as const).map((field: keyof Education) => (
                        <div key={field} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {field.charAt(0).toUpperCase() + field.slice(1)} Institution
                            </label>
                            <input
                                type="text"
                                {...form.register(`education.${field}`)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Enter your ${field} institution`}
                            />
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}