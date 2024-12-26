import AdminHeader from "@/components/admin/Header";

import { SidebarInset } from "@/components/ui/sidebar";

export default function FeaturesPage() {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Help', href: '/admin/dashboard/help' },
                { label: 'Requested Features', href: '/admin/dashboard/help/features', active: true },
            ]} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Requested Features</h1>
                    </div>

                </div>
            </div>
        </SidebarInset>
    );
}