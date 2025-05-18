import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { LogtoProvider, ClaimProps } from "@/providers/logto-session-provider";
// import { logtoConfig } from "../logto";
// import { getLogtoContext } from "@logto/next/server-actions";
import { AuthProvider } from "@/middleware/AuthProvider";

export default async function NpLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar />
                {children}
            </SidebarProvider>
        </AuthProvider>
    );
}