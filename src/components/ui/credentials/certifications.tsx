"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IUserProfile } from "@/app/models/UserProfile";

const certificationFormSchema = z.object({
  boardCertifications: z.string(),
  additionalCertifications: z.array(z.string()).optional(),
  npiNumber: z.string().min(10, "NPI number must be at least 10 digits"),
});

type CertificationFormValues = z.infer<typeof certificationFormSchema>;

export default function Certifications({ certifications }: { certifications: Partial<IUserProfile> }) {
    const form = useForm<CertificationFormValues>({
        resolver: zodResolver(certificationFormSchema),
        defaultValues: {
            boardCertifications: certifications.boardCertification || "",
            additionalCertifications: certifications.additionalCertifications || [],
            npiNumber: certifications.npiNumber || "",
        },
    });

    function onSubmit(data: CertificationFormValues) {
        // Handle form submission
        console.log(data);
    }

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Certifications</CardTitle>
                <p className="text-sm text-muted-foreground">
                    This will be shown to prospective Nurse Practitioners seeking a Collaborating Physician
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="boardCertifications"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Board Certifications:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter board certifications" {...field} />
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
                                    <FormLabel>Additional Certifications:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="npiNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>NPI#</FormLabel>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Please don&apos;t adjust this number after approved.
                                    </p>
                                    <FormControl>
                                        <Input placeholder="123456789" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Save</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}