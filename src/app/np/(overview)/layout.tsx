import Header from "@/components/header";
import { ThemeProvider } from "next-themes";

export default async function DashboardLayout({ children, stats, collaboratorRequests, activeCollaborator, modal }: { children: React.ReactNode, stats: React.ReactNode, collaboratorRequests: React.ReactNode, activeCollaborator: React.ReactNode, modal: React.ReactNode; }) {

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="bg-background min-h-screen w-full">
                <Header />
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1 flex-col space-y-8 p-8">
                        {children}
                        {stats}
                        {collaboratorRequests}
                        {activeCollaborator}
                    </div>
                </main>
                {modal}
            </div>
        </ThemeProvider>
    );
}