import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { AdminSidebar } from "@/components/admin/Sidebar";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getConfig } from "@/app/actions/config";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") redirect("/dashboard");

    const config = await getConfig();
    return (
        <SidebarProvider>
            <AdminSidebar config={config} />
            {children}
        </SidebarProvider>
    );
}