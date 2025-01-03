import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { getUserByEmail } from "@/app/actions/user";
import Header from "@/components/header";

export default async function DashboardLayout({ children, intro, collaboratorRequests, activeCollaborator, modal }: { children: React.ReactNode, intro: React.ReactNode, collaboratorRequests: React.ReactNode, activeCollaborator: React.ReactNode, modal: React.ReactNode; }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const user = await getUserByEmail(session.user.email);

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' }
            ]} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8 p-8">
                    <div className="flex items-center justify-between space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                            <p className="text-muted-foreground">
                                Welcome to your dashboard!
                            </p>
                        </div>
                    </div>
                    {children}
                    {!user.validated && (
                        intro
                    )}
                    {user.validated && (
                        <>
                            {collaboratorRequests}
                            {activeCollaborator}
                        </>
                    )}
                </div>
            </main>
            {modal}
        </div>
    );
}