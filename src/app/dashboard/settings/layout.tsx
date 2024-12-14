import Header from "@/components/header";
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
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                {
                    label: 'Settings',
                    href: '/dashboard/settings',
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