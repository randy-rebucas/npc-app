'use client';

import Header from "@/components/header";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ListingsLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    const { data: session } = useSession();

    useEffect(() => {
        const getUserCreateListingPermission = async (id: string) => {
            const response = await fetch(`/api/user/${id}/create-listing-permission`);
            const data = await response.json();
            if (!data.canCreateListings) {
                redirect("/not-authorized");
            }
        }
        if (session) {
            getUserCreateListingPermission(session.user.id);
        }
    }, [session]);
    
    return (
        <div className="min-h-screen w-full bg-background">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8">
                    <div className="space-y-6">
                        <div className="mb-4 flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-foreground">Listings</h1>
                            <Link
                                href="/np/listings/form"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90"
                            >
                                Add Listing
                            </Link>
                        </div>

                        {/* Collaborators Grid */}
                        {children}
                    </div>
                </div>
            </main>
            {modal}
        </div>
    )
}
