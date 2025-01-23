'use client';

import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function ReportModal() {
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast(); 

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Handle form submission
            const response = await fetch("/api/help/report", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (response.ok) {
                toast({
                    title: "Report submitted successfully",
                    description: "Thank you for your report. We will get back to you soon.",
                });
                form.reset();
                router.push("/np/help"); 
            } else {
                console.error("Failed to submit report");
                toast({
                    title: "Failed to submit report",
                    description: "Please try again later.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error in report:", error);
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
        <Modal>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Report an issue</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Issue Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Brief description of the issue" {...field} />
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
                                            placeholder="Detailed description of the issue"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Please provide as much detail as possible
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit Report"}
                        </Button>
                    </form>
                </Form>
            </div>
        </Modal>
    );
}