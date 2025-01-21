"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
});


export default function CollaboratorForm({ id }: { id: string | null }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    if (id) {
        // const getCollaborator = async () => {
        //     const collaborator = await fetch(`/api/admin/miscellaneous/collaborators/${id}`)
        //     const data = await collaborator.json();
        //     console.log(data)
        //     form.setValue("email", data?.email || "");


        //     console.log(form.getValues())
        // }
        // getCollaborator()
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Handle form submission
            const response = await fetch("/api/collaborators/invite", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (response.ok) {
                toast({
                    title: "Collaborator added successfully",
                    description: "Collaborator added successfully",
                });
                form.reset();
                router.push("/admin/dashboard/collaborators");
            } else {
                console.error("Failed to add collaborator");
                toast({
                    title: "Failed to add collaborator",
                    description: "Please try again later.",
                    variant: "destructive",
                });
            }

        } catch (error) {
            console.error("Error in collaborator:", error);
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Email of the collaborator" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Send Invitation"}
                </Button>
            </form>
        </Form>
    )
}