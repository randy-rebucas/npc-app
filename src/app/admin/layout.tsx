import { authOptions } from "../api/auth/[...nextauth]/options";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") redirect("/dashboard");

    return (
        <SidebarProvider>
            <AdminSidebar />

            {children}
        </SidebarProvider>
    );
}

