import { AuthProvider } from "@/middleware/AuthProvider";
import Footer from "@/components/root/Footer";
import Header from "@/components/root/Header";
import { ThemeProvider } from "next-themes";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <div className="min-h-screen bg-background text-foreground">
                    <Header />
                    {children}
                    <Footer />
                </div>
            </AuthProvider>
        </ThemeProvider>
    );
}