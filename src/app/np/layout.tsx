import { AppSidebar } from "@/components/sidebar";
import { ClaimProps, LogtoProvider } from "@/providers/logto-session-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import { getUser } from "../actions/user";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    const user = claims?.sub ? await getUser(claims.sub) : null;
    console.log(user);
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