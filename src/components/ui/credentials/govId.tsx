"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IUserProfile } from "@/app/models/UserProfile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


const formSchema = z.object({
  governmentId: z.instanceof(File).optional(),
});

export default function GovID({ govId }: { govId: Partial<IUserProfile> }) {
    const { toast } = useToast();
    const [govIdUrl, setGovIdUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    console.log(govId);
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setIsSubmitting(true);

        try {

            // Delete old file
            const deleteResponse = await fetch("/api/upload", {
                method: "DELETE",
                body: JSON.stringify({ path: govId.governmentIdPath }),
            });

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete old file");
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('file', values.governmentId as File);

            // Upload file to server
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }
            const data = await response.json();
            console.log(data);
            setGovIdUrl(data.url);

            if (data.url) {

                // Update profile photo path
                await fetch("/api/profile", {
                    method: "POST",
                    body: JSON.stringify({ governmentIdPath: data.url }),
                });

                toast({
                    title: "Success",
                    description: "File uploaded successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to upload file. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to upload file. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Government ID</CardTitle>
                <CardDescription>
                    Your record of upload of your Government Issue ID.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="governmentId"
                            render={({ field: { onChange } }) => (
                                <FormItem>
                                    <FormLabel>Upload Government ID</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => onChange(e.target.files?.[0])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="flex justify-between items-center">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                {govId.governmentIdPath ? 'Document Uploaded' : 'No Document'}
                            </Badge>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>

                        {govIdUrl || govId.governmentIdPath && (
                            <p className="text-sm text-muted-foreground">
                                Uploaded: {govIdUrl || govId.governmentIdPath}
                            </p>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}