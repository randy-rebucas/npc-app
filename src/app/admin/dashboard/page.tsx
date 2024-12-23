import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin/Header";

export default function AdminDashboard() {
    return <SidebarInset>
        <AdminHeader breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            {
                label: 'Dashboard',
                href: '/admin/dashboard',
                active: true,
            },
        ]} />
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>

                <p>Hello</p>
            </div>
        </div>
    </SidebarInset>;
}