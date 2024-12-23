export default function AdminDashboardLayout({ children, event }: { children: React.ReactNode, event: React.ReactNode }) {
    return (
        <>
            {children}
            {event}
        </>
    );
}