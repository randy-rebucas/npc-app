"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Separator } from "@radix-ui/react-separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export type Education = {
    undergrad: string;
    medical: string;
    residency: string;
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
export default function Education({ education, clinicalDegree, practiceTypes, practices }: { education: Education, clinicalDegree: string, practiceTypes: string[], practices: string[] }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log(practiceTypes)
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
    console.log(practices)
    async function onSubmit(data: EducationFormValues) {
        setIsSubmitting(true);

        try {
            // Update profile education
            const response = await fetch("/api/profile", {
                method: "POST",
                body: JSON.stringify({ clinicalDegree: data.clinicalDegree, education: data.education, practiceTypes: data.practiceTypes }),
            });

            if (!response.ok) {
                throw new Error("Failed to update education");
            }

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
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Degree</CardTitle>
                <p className="text-sm text-muted-foreground">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="clinicalDegree"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Clinical Degree Type:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="MD" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold">Practice Types</h2>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Select the practice types you are interested in
                            </p>
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="practiceTypes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Practice Types</FormLabel>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {field.value.map((type) => (
                                                <Badge key={type} variant="secondary">
                                                    {type}
                                                    <button
                                                        type="button"
                                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                        onClick={() => {
                                                            const newTypes = field.value.filter((t) => t !== type)
                                                            field.onChange(newTypes)
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                        <span className="sr-only">Remove</span>
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Select
                                            onValueChange={(value) => {
                                                if (!field.value.includes(value)) {
                                                    field.onChange([...field.value, value])
                                                }
                                            }}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select practice types" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {practices.filter(practice => !field.value.includes(practice)).map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Separator /> 

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold">Education</h2>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Tell us more about your education
                            </p>
                        </div>

                        <FormField
                            control={form.control}
                            name="education.undergrad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Undergrad Institution:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your undergraduate institution" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                                              
                        <FormField
                            control={form.control}
                            name="education.medical"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medical Degree Institution:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your medical school" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="education.residency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Residency Program:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your residency program" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}