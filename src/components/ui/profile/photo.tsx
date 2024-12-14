"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Photo() {
    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Handle file upload logic here
            console.log("File selected:", file);
        }
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
                    <AvatarImage src="/placeholder-avatar.png" alt="Profile picture" />
                    <AvatarFallback>PP</AvatarFallback>
                </Avatar>
                <input
                    type="file"
                    className="hidden"
                    id="profile-upload"
                    accept="image/*"
                    onChange={handleUpload}
                />
                <Button variant="secondary" className="flex items-center gap-2" onClick={() => document.getElementById("profile-upload")?.click()}>
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

            </CardContent>
        </Card>
    );
}
