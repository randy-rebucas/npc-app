import { AppSidebar } from "@/components/sidebar";
import { SessionProvider } from "@/providers/logto-session-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <SidebarProvider>
                <AppSidebar />
                {children}
            </SidebarProvider>
        </SessionProvider>
    );
}