'use client';

import Header from "@/components/header";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function CollaboratorsLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();
    const { data: session } = useSession();

    useEffect(() => {
        const getUserSubmissionStatus = async (id: string) => {
            const response = await fetch(`/api/user/${id}/submission-status`);
            const data = await response.json();
            if (data.submissionStatus !== 'APPROVED') {
                redirect("/not-authorized");
            }
        }
        if (session) {
            getUserSubmissionStatus(session.user.id);
        }
    }, [session]);

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8">
                    <div className="space-y-6">
                        <div className="mb-4 flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Collaborators</h1>
                            <Link
                                href="/np/collaborators/form"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Add Collaborator
                            </Link>
                        </div>

                        {/* Filter Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <Link
                                    href="/np/collaborators/active"
                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium ${currentTab === 'active'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Active Collaborators
                                </Link>
                                <Link
                                    href="/np/collaborators/request"
                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium ${currentTab === 'request'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Pending Requests
                                </Link>
                            </nav>
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