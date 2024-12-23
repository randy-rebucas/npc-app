import Listings from "@/components/ui/sharetribe/listings";
import { SidebarInset } from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin/Header";


export default function AdminPage() {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' }
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
                    <Listings />
                </div>
            </div>
        </SidebarInset>
    );
}
