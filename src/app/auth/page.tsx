"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";

export default function AuthPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="mx-auto w-full max-w-[350px] space-y-6 px-4">
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="flex items-center space-x-2">
                        <Icons.logo className="h-10 w-10" />
                        <span className="text-2xl font-bold">
                            {process.env.NEXT_PUBLIC_APP_NAME}
                        </span>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            Choose your preferred sign in method
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => signIn("logto", { callbackUrl: "/np" })}
                        className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        <Icons.logto className="mr-2 h-5 w-5" />
                        Continue with Credentials
                    </Button>

                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => signIn("linkedin", { callbackUrl: "/np" })}
                        className="w-full hover:bg-[#0A66C2] hover:text-white transition-colors"
                    >
                        <Icons.linkedin className="mr-2 h-5 w-5" />
                        Continue with LinkedIn
                    </Button>

                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/np" })}
                        className="w-full hover:bg-[#4285F4] hover:text-white transition-colors"
                    >
                        <Icons.google className="mr-2 h-5 w-5" />
                        Continue with Google
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <Link
                        href={process.env.NEXT_PUBLIC_TERMS_URL || "/terms"}
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms
                    </Link>{" "}
                    &{" "}
                    <Link
                        href={process.env.NEXT_PUBLIC_PRIVACY_URL || "/privacy"}
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    );
}
