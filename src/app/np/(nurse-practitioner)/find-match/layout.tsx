'use client';

import Header from "@/components/header";
// import { useSession } from "@/providers/logto-session-provider";
// import { redirect } from "next/navigation";
// import { useEffect } from "react";

export default function FindMatchLayout({
    children,
    modal,
}: {
    children: React.ReactNode
    modal: React.ReactNode
}) {
    // const { claims } = useSession();

    // useEffect(() => {
    //     const getUserSubmissionStatus = async (id: string) => {
    //         const response = await fetch(`/api/user/${id}/submission-status`);
    //         const data = await response.json();
    //         if (data.submissionStatus !== 'APPROVED') {
    //             redirect("/not-authorized");
    //         }
    //     }
    //     if (claims?.sub) {
    //         getUserSubmissionStatus(claims.sub);
    //     }
    // }, [claims]);

    return (
        <div className="min-h-screen w-full bg-background">
            <Header showSearch={true} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8">
                    <div className="space-y-6">
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-foreground">Find Match</h1>
                        </div>
                        {children}
                    </div>
                </div>
            </main>
            {modal}
        </div>
    );
}