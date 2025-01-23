import { AppSidebar } from "@/components/sidebar";

import { SidebarProvider } from "@/components/ui/sidebar";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "../actions/user";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);    

    if (!session) {
        redirect("/auth/signin");
    }

    const user = await getUserByEmail(session.user.email);

    if (user.role === "ADMIN") {
        redirect("/admin");
    }

    return (
        <SidebarProvider>
            <AppSidebar />

            {children}
        </SidebarProvider>
    );
}