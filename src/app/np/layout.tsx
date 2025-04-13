import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LogtoProvider, ClaimProps } from "@/providers/logto-session-provider";
import { logtoConfig } from "../logto";
import { getLogtoContext } from "@logto/next/server-actions";

export default async function NpLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig, { 
        fetchUserInfo: true
      });
      
    return (
        <LogtoProvider
            isAuthenticated={isAuthenticated}
            claims={claims as ClaimProps}
        >
            <SidebarProvider>
                <AppSidebar />
                {children}
            </SidebarProvider>
        </LogtoProvider>
    );
}