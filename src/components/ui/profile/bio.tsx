'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IUserProfile } from "@/app/models/UserProfile";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const bioFormSchema = z.object({
    description: z.string().min(1, "Background is required"),
    boardCertification: z.string().min(1, "Board certifications are required"),
    linkedinProfile: z.string().url().optional().or(z.literal("")),
});

type BioFormValues = z.infer<typeof bioFormSchema>;

export default function Bio({ bio }: { bio: Partial<IUserProfile> }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<BioFormValues>({
        resolver: zodResolver(bioFormSchema),
        defaultValues: {
            description: bio.description || '',
            boardCertification: bio.boardCertification || '',
            linkedinProfile: bio.linkedinProfile || '',
        },
    });

    async function onSubmit(data: BioFormValues) {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            toast({
                title: "Success!",
                description: "Your profile has been updated.",
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Bio</CardTitle>
                <p className="text-sm text-muted-foreground">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician after our matching process.
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Background:</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            {...field}
                                            placeholder="Tell us about your medical background and experience..."
                                            className="min-h-[100px] resize-none"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="boardCertification"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Board Certifications:</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="e.g., American Board of Internal Medicine (ABIM)"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="linkedinProfile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LinkedIn Profile:</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            type="url"
                                            placeholder="https://linkedin.com/in/your-profile"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
