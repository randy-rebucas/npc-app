'use client';

import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/dist/client/components/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
});

export default function FeatureModal() {
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
            const response = await fetch("/api/help/feature", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (response.ok) {
                console.log("Report submitted successfully");
                toast({
                    title: "Feature requested successfully",
                    description: "Thank you for your feature request. We will get back to you soon.",
                });
                form.reset();
                router.push("/dashboard/help");
            } else {
                console.error("Failed to submit report");
                toast({
                    title: "Failed to request feature",
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
                <h2 className="text-2xl font-semibold mb-4">Feature Request</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Feature Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter feature title..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a clear and concise title for your feature request.
                                    </FormDescription>
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
                                            placeholder="Describe your feature request in detail..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Explain how this feature would benefit users.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit Feature Request"}
                        </Button>
                    </form>
                </Form>
            </div>
        </Modal>
    );
}