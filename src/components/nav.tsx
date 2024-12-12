import { logtoConfig } from "@/app/logto";
import { signIn, signOut, getLogtoContext } from "@logto/next/server-actions";
import SignIn from "./sign-in";
import SignOut from "./sign-out";
import Image from 'next/image';
import NavLinks from "./nav-links";
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function Nav() {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

    return (
        <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4" >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Image 
                        src="https://cdn.prod.website-files.com/668ac3475fa3479b9cfb7893/669f12afa08db593880fa90a_NP%20COLABORATOR%20BACKGROUND%20TRANSP%20160%20x%2043.png" 
                        alt="Logo" 
                        width={200} 
                        height={100} 
                        className="h-8 w-auto"
                        priority
                    />
                    <NavLinks />
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                    <span>{claims?.name || claims?.sub}</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">Settings</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <SignOut
                                onSignOut={async () => {
                                    'use server';
                                    await signOut(logtoConfig);
                                }}
                            />
                        </div>
                    ) : (
                        <SignIn
                            onSignIn={async () => {
                                'use server';
                                await signIn(logtoConfig);
                            }}
                        />
                    )}
                </div>
            </div>
        </nav>
    );
}