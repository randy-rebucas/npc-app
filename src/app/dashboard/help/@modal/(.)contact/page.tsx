'use client';

import Modal from "@/components/modal";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  subject: z.string(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

const SUBJECT_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "technical", label: "Technical Support" },
  { value: "billing", label: "Billing Question" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

export default function ContactModal() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            message: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Handle form submission
            const response = await fetch("/api/help/enquiry", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (response.ok) {
                toast({
                    title: "Enquiry submitted successfully",
                    description: "Thank you for your enquiry. We will get back to you soon.",
                });
                form.reset();
                router.push("/dashboard/help");
            } else {
                console.error("Failed to submit report");
                toast({
                    title: "Failed to submit enquiry",
                    description: "Please try again later.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error in enquiry:", error);
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
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                            placeholder="Type your message here" 
                                            className="resize-none" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        We&apos;ll use this message to respond to your message.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Send Message"}
                        </Button>
                    </form>
                </Form>
            </div>
        </Modal>
    );
} 