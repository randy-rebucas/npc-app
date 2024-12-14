import Footer from "@/components/root/Footer";
import Header from "@/components/root/Header";
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}