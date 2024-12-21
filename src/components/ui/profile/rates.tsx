'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { IUserProfile } from "@/app/models/UserProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const ratesSchema = z.object({
    monthlyCollaborationRate: z.number().min(0, "Base rate must be positive"),
    additionalStateFee: z.number().min(0, "State rate must be positive"),
    additionalNPFee: z.number().min(0, "NP rate must be positive"),
    controlledSubstancesMonthlyFee: z.number().nullable(),
    controlledSubstancesPerPrescriptionFee: z.number().nullable(),
});

type RatesFormValues = z.infer<typeof ratesSchema>;

export default function Rates({ rates }: { rates: Partial<IUserProfile> }) {
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const { toast } = useToast();

    const form = useForm<RatesFormValues>({
        resolver: zodResolver(ratesSchema),
        defaultValues: {
            monthlyCollaborationRate: rates.monthlyCollaborationRate ?? 0,
            additionalStateFee: rates.additionalStateFee ?? 0,
            additionalNPFee: rates.additionalNPFee ?? 0,
            controlledSubstancesMonthlyFee: rates.controlledSubstancesMonthlyFee ?? 0,
            controlledSubstancesPerPrescriptionFee: rates.controlledSubstancesPerPrescriptionFee ?? 0,
        },
    });

    const onSubmit = async (data: RatesFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Update Your Rate Matrix</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        During our matching process, we will quote your base rate plus any additional fees based on your choices below.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Please be aware, adjustments in Rates may take 2-3 business days to appear in your profile for prospective Nurse Practitioners.
                    </p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="monthlyCollaborationRate"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label>Monthly Base Collaboration Rate?</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Information about base collaboration rate</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                                <Input
                                                    type="number"
                                                    className="pl-7"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="additionalStateFee"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label>Additional State Fee (per state)?</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Information about state fee</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                                <Input
                                                    type="number"
                                                    className="pl-7"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="additionalNPFee"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label>Additional Nurse Practitioner Fee? (multi-NP practices)</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Information about NP fee</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                                <Input
                                                    type="number"
                                                    className="pl-7"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="controlledSubstancesPerPrescriptionFee"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label>*Optional* Controlled substances prescribing fee per prescription?</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Information about controlled substances prescribing fee per prescription</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                                <Input
                                                    type="number"
                                                    className="pl-7"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="controlledSubstancesMonthlyFee"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label>*Optional* Controlled substances prescribing monthly fee?</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Information about controlled substances fee</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                                <Input
                                                    type="number"
                                                    className="pl-7"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
