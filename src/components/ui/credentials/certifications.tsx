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
import { Certification } from "@/lib/types/onboarding";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar"

const certificationFormSchema = z.object({
    boardCertifications: z.string(),
    additionalCertifications: z.array(z.object({
        certification: z.string().min(1, "Certification is required"),
        issueDate: z.date({
            required_error: "Issue date is required",
        }),
        expirationDate: z.date({
            required_error: "Expiration date is required",
        }),
        certificateUrl: z.string().url("Invalid certificate URL"),
        certificateNumber: z.string().min(1, "Certificate number is required"),
    })),
    npiNumber: z.string().min(10, "NPI number must be at least 10 digits"),
});

type CertificationFormValues = z.infer<typeof certificationFormSchema>;

export default function Certifications({ boardCertification, additionalCertifications, npiNumber }: { boardCertification: string, additionalCertifications: Certification[], npiNumber: string }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<CertificationFormValues>({
        resolver: zodResolver(certificationFormSchema),
        defaultValues: {
            boardCertifications: boardCertification || "",
            additionalCertifications: additionalCertifications.map(certification => ({
                certification: certification.certification,
                issueDate: certification.issueDate ? new Date(certification.issueDate) : new Date(),
                expirationDate: certification.expirationDate ? new Date(certification.expirationDate) : new Date(),
                certificateUrl: certification.certificateUrl ? certification.certificateUrl : "",
                certificateNumber: certification.certificateNumber ? certification.certificateNumber : "",
            })),
            npiNumber: npiNumber || "",
        },
    });

    async function onSubmit(data: CertificationFormValues) {
        setIsSubmitting(true);
        try {
            // Update profile certifications
            const response = await fetch("/api/profile", {
                method: "POST",
                body: JSON.stringify({ additionalCertifications: data.additionalCertifications, npiNumber: data.npiNumber, boardCertification: data.boardCertifications }),
            });

            if (!response.ok) {
                throw new Error("Failed to update certifications");
            }

            toast({
                title: "Success!",
                description: "Your certifications have been updated.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update certifications",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
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
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel>Additional Certifications:</FormLabel>
                            </div>

                            {form.watch("additionalCertifications").map((_, index) => (
                                <div key={index} className="space-y-4 rounded-lg border p-4 relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive absolute right-2 top-2"
                                        onClick={() => {
                                            const current = form.getValues("additionalCertifications");
                                            form.setValue(
                                                "additionalCertifications",
                                                current.filter((_, i) => i !== index)
                                            );
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>

                                    <FormField
                                        control={form.control}
                                        name={`additionalCertifications.${index}.certification`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certification Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`additionalCertifications.${index}.issueDate`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Issue Date</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-[280px] justify-start text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0"> 
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}       
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`additionalCertifications.${index}.expirationDate`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Expiration Date</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-[280px] justify-start text-left font-normal",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`additionalCertifications.${index}.certificateNumber`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certificate Number</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`additionalCertifications.${index}.certificateUrl`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certificate URL/File</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.setValue("additionalCertifications", [
                                        ...form.getValues("additionalCertifications"),
                                        {
                                            certification: "",
                                            issueDate: new Date(),
                                            expirationDate: new Date(),
                                            certificateUrl: "",
                                            certificateNumber: "",
                                        },
                                    ]);
                                }}
                            >
                                <Plus className="h-4 w-4" />
                                Add Certification
                            </Button>

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