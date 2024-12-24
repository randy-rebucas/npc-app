import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin/Header";

export default function OverviewLayout({
    children,
    event,
    chart,
    user
}: {
    children: React.ReactNode,
    event: React.ReactNode,
    chart: React.ReactNode,
    user: React.ReactNode
}) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Dashboard', href: '/admin/dashboard', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full">

                    {children}

                    {/* Activity Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {chart}

                        {event}
                    </div>

                    {/* Members Table */}
                    {user}
                </div>
            </div>
        </SidebarInset>
    );
}