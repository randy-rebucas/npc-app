export const dynamic = 'force-dynamic';

import { AdminSidebar } from "@/components/admin/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";


export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider>
            <AdminSidebar/>
            {children}
        </SidebarProvider>
    );
}