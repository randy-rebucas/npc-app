import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";


export default function SettingsLayout({
    children,
    profile,
    password,
}: {
    children: React.ReactNode,
    profile: React.ReactNode,
    password: React.ReactNode,
}) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                {
                    label: 'Settings',
                    href: '/admin/settings',
                    active: true,
                },
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {children}
                {profile}
                {password}
            </div>
        </SidebarInset>
    );
}