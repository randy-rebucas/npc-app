import { AppSidebar } from "@/components/ui/app-sidebar";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />

            {children}
        </SidebarProvider>
    );
}