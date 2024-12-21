'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { License } from "@/lib/types/onboarding";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
// Add form schema
const licenseSchema = z.object({
    medicalLicenseStates: z.array(z.object({
        state: z.string().min(1, "State is required"),
        licenseNumber: z.string().min(1, "License number is required"),
        expirationDate: z.date({
            required_error: "Expiration date is required",
        })
    })),
    deaLicenseStates: z.array(z.object({
        state: z.string().min(1, "State is required"),
        licenseNumber: z.string().min(1, "License number is required"),
        expirationDate: z.date({
            required_error: "Expiration date is required",
        })
    }))
})

export default function Licenses({ medicalLicenseStates, deaLicenseStates, states }: { medicalLicenseStates: License[], deaLicenseStates: License[], states: string[] }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof licenseSchema>>({
        resolver: zodResolver(licenseSchema),
        defaultValues: {
            medicalLicenseStates: medicalLicenseStates.map(medicalLicense => ({
                state: medicalLicense.state,
                licenseNumber: medicalLicense.licenseNumber,
                expirationDate: medicalLicense.expirationDate ? new Date(medicalLicense.expirationDate) : new Date()
            })),
            deaLicenseStates: deaLicenseStates.map(deaLicense => ({
                state: deaLicense.state,
                licenseNumber: deaLicense.licenseNumber,
                expirationDate: deaLicense.expirationDate ? new Date(deaLicense.expirationDate) : new Date()
            }))
        }
    })

    async function onSubmit(values: z.infer<typeof licenseSchema>) {
        setIsSubmitting(true);
        try {
            // Update profile licenses
            const response = await fetch("/api/profile", {
                method: "POST",
                body: JSON.stringify({ medicalLicenseStates: values.medicalLicenseStates, deaLicenseStates: values.deaLicenseStates }),
            });

            if (!response.ok) {
                throw new Error("Failed to update licenses");
            }

            toast({
                title: "Success!",
                description: "Your licenses have been updated.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update licenses",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">License Information</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            License verification is checked prior to all collaboration initiations. Please make sure your information is up to date.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">*NP Collaborator</span> is currently serving{" "}
                            <span className="font-medium">NJ, MI, OH, TX</span> - We&apos;ll be expanding to additional states very soon.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <h1 className="text-sm font-semibold">
                            Medical licenses. <br/>
                            <span className="text-xs text-muted-foreground">
                                Medical licenses are required for all NP Collaborators.
                            </span>
                        </h1>
                        {form.watch("medicalLicenseStates").map((medicalLicense, index) => (
                            <div key={index} className="grid gap-4 p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="grid gap-4 md:grid-cols-2 flex-1">
                                        <FormField
                                            control={form.control}
                                            name={`medicalLicenseStates.${index}.state`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State License</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select state" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {states.map((state) => (
                                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`medicalLicenseStates.${index}.licenseNumber`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>License #</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter license number" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {form.watch("medicalLicenseStates").length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => {
                                                const currentLicenses = form.getValues("medicalLicenseStates");
                                                const updatedLicenses = currentLicenses.filter((_, i) => i !== index);
                                                form.setValue("medicalLicenseStates", updatedLicenses);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`medicalLicenseStates.${index}.expirationDate`}
                                    render={({ field }) => (
                                        <FormItem className="md:w-1/2">
                                            <FormLabel>Exp. Date</FormLabel>
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
                        ))}

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    const medicalLicenses = form.getValues("medicalLicenseStates");
                                    form.setValue("medicalLicenseStates", [
                                        ...medicalLicenses,
                                        {
                                            state: '',
                                            licenseNumber: '',
                                            expirationDate: new Date()
                                        }
                                    ]);
                                }}
                            >
                                Add New License
                            </Button>

                        </div>

                        <Separator />

                        <h1 className="text-sm font-semibold">
                            DEA licenses. <br/>
                            <span className="text-xs text-muted-foreground">
                                DEA licenses are required for all NP Collaborators.
                            </span>
                        </h1>
                        {form.watch("deaLicenseStates").map((deaLicense, index) => (
                            <div key={index} className="grid gap-4 p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="grid gap-4 md:grid-cols-2 flex-1">
                                        <FormField
                                            control={form.control}
                                            name={`deaLicenseStates.${index}.state`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State License</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select state" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {states.map((state) => (
                                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`deaLicenseStates.${index}.licenseNumber`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>License #</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Enter license number" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {form.watch("deaLicenseStates").length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => {
                                                const currentLicenses = form.getValues("deaLicenseStates");
                                                const updatedLicenses = currentLicenses.filter((_, i) => i !== index);
                                                form.setValue("deaLicenseStates", updatedLicenses);
                                            }}
                                        >
                                            <X className="h-4 w-4" /> 
                                        </Button>
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`deaLicenseStates.${index}.expirationDate`}
                                    render={({ field }) => (
                                        <FormItem className="md:w-1/2">
                                            <FormLabel>Exp. Date</FormLabel>
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
                        ))}

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    const deaLicenses = form.getValues("deaLicenseStates");
                                    form.setValue("deaLicenseStates", [
                                        ...deaLicenses,
                                        {
                                            state: '',
                                            licenseNumber: '',
                                            expirationDate: new Date()
                                        }
                                    ]);
                                }}
                            >
                                <Plus className="h-4 w-4" />
                                Add New License
                            </Button>

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}