"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
    subject: z.string().min(2, "Subject must be at least 2 characters"),
    message: z.string().min(2, "Message must be at least 2 characters"),
    status: z.enum(["pending", "resolved", "closed"]).default("pending"),
});

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
    { value: "in_progress", label: "In Progress" },
];

const SUBJECT_OPTIONS = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing Question" },
    { value: "feedback", label: "Feedback" },
    { value: "other", label: "Other" },
];

interface EnquiryFormProps {
    id: string | null;
}

export default function EnquiryForm({ id }: EnquiryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            message: "",
            status: "pending",
        },
    });

    const getEnquiry = async () => {
        const enquiry = await fetch(`/api/admin/help/enquiries/${id}`);
        const data = await enquiry.json();

        form.setValue("message", data?.message || "");
        form.setValue("status", data?.status || "pending");
        form.setValue("subject", data?.subject || "");
    }

    if (id) {
        getEnquiry()
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            if (id) {
                const response = await fetch(`/api/admin/help/enquiries/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast({
                        title: "Enquiry updated successfully",
                        description: "Enquiry updated successfully",
                    });
                    form.reset();
                    router.push("/admin/dashboard/help/enquiries");
                } else {
                    toast({
                        title: "Failed to update enquiry",
                        description: "Please try again later.",
                        variant: "destructive",
                    });
                }
            } else {
                // Handle form submission
                const response = await fetch("/api/admin/help/enquiries", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast({
                        title: "Enquiry added successfully",
                        description: "Enquiry added successfully",
                    });
                    form.reset();
                    router.push("/admin/dashboard/help/enquiries");
                } else {
                    console.error("Failed to add enquiry");
                    toast({
                        title: "Failed to add enquiry",
                        description: "Please try again later.",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            console.error("Error in feature:", error);
            toast({
                title: "Error",
                description: "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {SUBJECT_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Please select the subject of your inquiry
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe your enquiry"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                We&apos;ll use this message to respond to your enquiry.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Please select the status of your feature
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : id ? "Update Enquiry" : "Add Enquiry"}
                </Button>
            </form>
        </Form>
    )
}