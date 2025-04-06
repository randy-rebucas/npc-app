import { AppSidebar } from "@/components/sidebar";
// import { ClaimProps, LogtoProvider } from "@/providers/logto-session-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { getLogtoContext } from "@logto/next/server-actions";
// import { logtoConfig } from "@/app/logto";

export default async function NpLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    return (
        // <LogtoProvider
        //     isAuthenticated={isAuthenticated}
        //     claims={claims as ClaimProps}
        // >
            <SidebarProvider>
                <AppSidebar />
                {children}
            </SidebarProvider>
        // </LogtoProvider>
    );
}