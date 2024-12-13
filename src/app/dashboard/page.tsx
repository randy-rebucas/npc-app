import Header from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { sdk } from "@/lib/sharetribe";

export default async function Dashboard() {
    // Add Sharetribe listings fetch
    const listings = await sdk.listings.query({
        pub_index: 'default',
        include: ['images', 'author'],
    });

    return (
        <SidebarInset>
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' }
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
                    <h1 className="text-2xl font-bold mb-4">Listings</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {listings.data.data.map((listing: { id: string; attributes: { title: string; description: string; }; }, index: number) => (
                            <div key={index} className="border rounded-lg p-4 shadow-sm">
                                <h3 className="text-xl font-semibold">{listing.attributes.title}</h3>
                                <p className="text-gray-600">{listing.attributes.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SidebarInset>
    );
}