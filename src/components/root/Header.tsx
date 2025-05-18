"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import SignIn from "@/components/sign-in";
import { SignOut } from "../sign-out";
import { ThemeToggle } from "../theme-toggle";
import { useAuth } from "@/middleware/AuthProvider";

export default function Header() {
    const { isAuthenticated, handleLogout, handleSignIn } = useAuth();
    const { theme } = useTheme();

    return (
        <header className="px-6 py-4">
            <div className="container mx-auto max-w-7xl px-4 flex justify-between items-center">
                {/* Logo */}
                <div className="logo">
                    <Image
                        src={theme === 'dark' ? '/logo-white.png' : '/logo-black.png'}
                        alt="NP Collaborator Logo"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-auto h-auto"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-8">
                    <Link href="/" className="text-foreground hover:text-muted-foreground">Home</Link>
                    <Link href="/nurse" className="text-foreground hover:text-muted-foreground">Nurse Practitioners</Link>
                    <Link href="/physician" className="text-foreground hover:text-muted-foreground">Physician Collaborators</Link>
                    {isAuthenticated && (
                        <>
                            <Link href="/np" className="text-foreground hover:text-muted-foreground">Dashboard</Link>
                            <SignOut onSignOutAction={handleLogout} />
                        </>
                    )}
                    {!isAuthenticated && (
                        <SignIn onSignIn={handleSignIn} />
                    )}
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}