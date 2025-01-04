import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

import { getUserByEmail } from "@/app/actions/user";
import Header from "@/components/header";

export default async function DashboardLayout({ children, intro, stats, collaboratorRequests, activeCollaborator, modal }: { children: React.ReactNode, intro: React.ReactNode, stats: React.ReactNode, collaboratorRequests: React.ReactNode, activeCollaborator: React.ReactNode, modal: React.ReactNode; }) {
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

                    {children}
                    {!user.validated && (
                        intro
                    )}
                    {user.validated && (
                        <>
                            {stats}
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