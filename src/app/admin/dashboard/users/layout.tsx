import AdminHeader from "@/components/admin/Header";

import { SidebarInset } from "@/components/ui/sidebar";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Users', href: '/admin/dashboard/users', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    {children}
                </div>
            </div>
        </SidebarInset>
    )
}
