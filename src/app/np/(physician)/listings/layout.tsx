'use client';

import Header from "@/components/header";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
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
                        

                        {/* Collaborators Grid */}
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
