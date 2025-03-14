"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(2, "Description must be at least 2 characters"),
    resource: z.string().min(2, "Resource must be at least 2 characters"),
});

export default function PermissionForm({ id }: { id: string | null }) { 
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            resource: "",
        },
    });

    useEffect(() => {
        const getPermission = async () => {
            if (id) {
                try {
                    const permission = await fetch(`/api/admin/permissions/${id}`)
                    const data = await permission.json();
                    form.reset(data);
                } catch (error) {
                    console.error("Error fetching permission:", error);
                    toast({
                        title: "Error",
                        description: "Failed to load permission data",
                        variant: "destructive",
                    });
                }
            }
        }
        getPermission();
    }, [id, form, toast]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            if (id) {
                const response = await fetch(`/api/admin/permissions/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast({
                        title: "Permission updated successfully",
                        description: "Permission updated successfully",
                    });
                    form.reset();
                    router.push("/admin/dashboard/permissions");
                } else {
                    toast({
                        title: "Failed to update permission",
                        description: "Please try again later.",
                        variant: "destructive",
                    });
                }
            } else {
                // Handle form submission
                const response = await fetch("/api/admin/permissions", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    toast({
                        title: "Permission added successfully",
                        description: "Permission added successfully",
                    });
                    form.reset();
                    router.push("/admin/dashboard/permissions");
                } else {
                    console.error("Failed to add permission");
                    toast({
                        title: "Failed to add permission",
                        description: "Please try again later.",
                        variant: "destructive",
                    });
                }
            }
        } catch (error) {
            console.error("Error in permission:", error);
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name of the permission" {...field} />
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
                                <Input placeholder="Description of the permission" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="resource"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resource</FormLabel>
                            <FormControl>
                                <Input placeholder="Resource of the permission" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : id ? "Update Permission" : "Add Permission"}
                </Button>
            </form>
        </Form>
    )
}