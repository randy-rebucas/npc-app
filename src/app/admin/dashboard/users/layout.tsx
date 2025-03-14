'use client'

import { useParams } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Suspense } from "react";
import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";

interface UserLayoutProps {
    children: React.ReactNode;
    detail?: React.ReactNode;
    modal?: React.ReactNode;
}

const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Users', href: '/admin/dashboard/users', active: true },
];

export default function UserLayout({ children, detail, modal }: UserLayoutProps) {
    const { id } = useParams<{ id: string }>();

    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={breadcrumbs} />
            <ErrorBoundary>
                <div className="flex flex-1 gap-4 p-4">
                    <div className={`space-y-4 ${id ? 'flex-[2]' : 'w-full'}`}>
                        <Suspense fallback={<LoadingSpinner />}>
                            {children}
                        </Suspense>
                    </div>

                    {id && detail && (
                        <div className="flex-1 border-l px-4">
                            <Suspense fallback={<LoadingSpinner />}>
                                {detail}
                            </Suspense>
                        </div>
                    )}
                </div>
                {modal}
            </ErrorBoundary>
        </SidebarInset>
    );
}