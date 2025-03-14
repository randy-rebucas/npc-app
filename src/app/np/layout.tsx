import { AppSidebar } from "@/components/sidebar";

import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
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