"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    boardCertification: z.string().min(1, "Board certification is required"),
    practiceTypes: z.array(z.string()).min(1, "At least one practice type is required"),
    stateLicenses: z.array(z.string()).min(1, "At least one state license is required"),
    specialties: z.string().min(1, "At least one specialty is required"),
    additionalCertifications: z.string(),
    monthlyBaseRate: z.number().min(0, "Base rate must be positive"),
    multipleNPFee: z.number().min(0, "Fee must be positive"),
    additionalFeePerState: z.number().min(0, "Fee must be positive"),
    controlledSubstanceFee: z.number().min(0, "Fee must be positive"),
});

export default function ListingForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [practiceTypesItems, setPracticeTypesItems] = useState<string[]>([]);
    const [medicalLicenseStates, setMedicalLicenseStates] = useState<string[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);

        // Fetch practice types
        const fetchPracticeTypes = async () => {
            const response = await fetch("/api/practicetypes");
            const data = await response.json();
            setPracticeTypesItems(data);
        };
        fetchPracticeTypes();

        const fetchMedicalLicenseStates = async () => {
            const response = await fetch("/api/medical-license-states");
            const data = await response.json();
            setMedicalLicenseStates(data);
        };
        fetchMedicalLicenseStates();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            boardCertification: "",
            practiceTypes: [],
            stateLicenses: [],
            specialties: "",
            additionalCertifications: "",
            monthlyBaseRate: 0,
            multipleNPFee: 0,
            additionalFeePerState: 0,
            controlledSubstanceFee: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Handle form submission
            const response = await fetch("/api/listings", {
                method: "POST",
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Listing created successfully",
                    description: "Your listing has been created successfully",
                    variant: "default",
                });
                form.reset();
                router.push("/np/listings");
            } else {
                toast({
                    title: "Failed to create listing",
                    description: data.message,
                    variant: "destructive",
                });
            }

        } catch (error) {
            console.error("Error in create listing:", error);
            toast({
                title: "Error",
                description: "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-12">
                {/* Basic Information */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold">Basic Information</h2>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide a detailed description of your practice..."
                                            className="h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                {/* Qualifications */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold">Qualifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="boardCertification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Board Certification</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Board Certification" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="specialties"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specialties</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Specialties" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="additionalCertifications"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Certifications</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Additional Certifications" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                {/* Practice Details */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold">Practice Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="practiceTypes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Practice Types</FormLabel>
                                    <div className="space-y-2 p-4 border rounded-md max-h-48 overflow-y-auto">
                                        {practiceTypesItems.map((type) => (
                                            <div key={type} className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value.includes(type)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                field.onChange([...field.value, type]);
                                                            } else {
                                                                field.onChange(field.value.filter((item: string) => item !== type));
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <label>{type}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stateLicenses"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State Licenses</FormLabel>
                                    <div className="space-y-2 p-4 border rounded-md max-h-48 overflow-y-auto">
                                        {medicalLicenseStates.map((state) => (
                                            <div key={state} className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value.includes(state)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                field.onChange([...field.value, state]);
                                                            } else {
                                                                field.onChange(field.value.filter((item: string) => item !== state));
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <label>{state}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                {/* Fees */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold">Fees</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="monthlyBaseRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monthly Base Rate</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <p className="text-sm text-muted-foreground">
                                        The standard rate for your services
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="multipleNPFee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Multiple NP Fee</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="additionalFeePerState"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Fee Per State</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="controlledSubstanceFee"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Controlled Substance Fee</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>
                <div className="flex justify-between">
                    <Link href="/np/listings" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90">
                        Cancel
                    </Link>
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>Creating Listing...</span>
                            </div>
                        ) : (
                            "Submit Listing"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
