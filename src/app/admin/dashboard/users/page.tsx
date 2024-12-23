import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";

export default function AdminUsers() {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Users', href: '/admin/dashboard/users', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full">
                    <h1>Users</h1>
                </div>
            </div>
        </SidebarInset>
    );
}   