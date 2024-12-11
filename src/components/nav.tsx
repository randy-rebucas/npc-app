import { signOut } from "@logto/next/server-actions";

import { logtoConfig } from "@/app/logto";
import { signIn } from "@logto/next/server-actions";
import SignIn from "./sign-in";
import SignOut from "./sign-out";
import Image from 'next/image';
import { getLogtoContext } from "@logto/next/server-actions";

export default async function Nav() {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

    return (
        <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4" >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Image src="https://cdn.prod.website-files.com/668ac3475fa3479b9cfb7893/669f12afa08db593880fa90a_NP%20COLABORATOR%20BACKGROUND%20TRANSP%20160%20x%2043.png" alt="Logo" width={200} height={100} className="h-8 w-auto" />
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <span className="text-gray-600">Welcome, {claims?.name || claims?.sub}</span>
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