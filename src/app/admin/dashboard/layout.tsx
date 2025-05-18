export const dynamic = 'force-dynamic';

import { AdminSidebar } from "@/components/admin/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/AuthProvider";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <AuthProvider>
            <SidebarProvider>
                <AdminSidebar/>
                {children}
            </SidebarProvider>
        </AuthProvider>
    );
}