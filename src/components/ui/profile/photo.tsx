"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUserProfile } from "@/app/models/UserProfile";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  photo: z.instanceof(File).optional(),
})

export default function Photo({ photo }: { photo: Partial<IUserProfile> }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const handleUpload = (file: File) => {
        // Handle file upload logic here
        console.log("File selected:", file);
    };

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Profile Picture</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Please make sure your information is up to date.
                </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                    <AvatarImage src={photo.profilePhotoUrl} alt={`${photo.firstName ?? ''} ${photo.lastName ?? ''}`} />
                    <AvatarFallback>{(photo.firstName?.charAt(0) ?? '').toUpperCase() + (photo.lastName?.charAt(0) ?? '').toUpperCase()}</AvatarFallback>
                </Avatar>
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="photo"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="profile-upload"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    field.onChange(file)
                                                    handleUpload(file)
                                                }
                                            }}
                                        />
                                        <Button 
                                            variant="secondary" 
                                            className="flex items-center gap-2" 
                                            onClick={() => document.getElementById("profile-upload")?.click()}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                            Upload Image
                                        </Button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </Form>
            </CardContent>
        </Card>
    );
}
