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

const formSchema = z.object({
    category: z.string().min(1, "Category is required"),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    boardCertification: z.string().min(1, "Board certification is required"),
    practiceType: z.string().min(1, "Practice type is required"),
    practiceName: z.string().min(1, "Practice name is required"),
    stateLicenses: z.string().min(1, "State licenses are required"),
    specialties: z.string().min(1, "At least one specialty is required"),
    additionalCertifications: z.string(),
    baseRate: z.number().min(0, "Base rate must be positive"),
    multipleNPFee: z.number().min(0, "Fee must be positive"),
    additionalFeePerState: z.number().min(0, "Fee must be positive"),
    controlledSubstanceFee: z.number().min(0, "Fee must be positive"),
});

export default function ListingForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: "",
            title: "",
            description: "",
            boardCertification: "",
            practiceType: "",
            practiceName: "",
            stateLicenses: "",
            specialties: "",
            additionalCertifications: "",
            baseRate: 0,
            multipleNPFee: 0,
            additionalFeePerState: 0,
            controlledSubstanceFee: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Handle form submission
            const response = await fetch("/api/listings/create", {
                method: "POST",
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Listing created successfully",
                    description: "Listing created successfully",
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Basic Information</h3>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Title"
                                        {...field}
                                    />
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

                {/* Practice Details Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Practice Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Category"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="boardCertification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Board Certification</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Board Certification"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="practiceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Practice Type</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Practice Type"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="practiceName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Practice Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Practice Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Qualifications Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Qualifications</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="stateLicenses"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State Licenses</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="State Licenses"
                                            {...field}
                                        />
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
                                        <Input
                                            type="text"
                                            placeholder="Specialties"
                                            {...field}
                                        />
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
                                        <Input
                                            type="text"
                                            placeholder="Additional Certifications"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Fees Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Fee Structure</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="baseRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Rate</FormLabel>
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
                                            placeholder="Multiple NP Fee"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="additionalFeePerState"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Fee Per State</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Additional Fee Per State"
                                            {...field}
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
                                            placeholder="Controlled Substance Fee"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
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
            </form>
        </Form>
    );
}
