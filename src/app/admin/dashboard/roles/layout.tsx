export default function AdminDashboardRolesLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) { 
    return (
        <>
            {children}
            {modal}
        </>
    );
}
