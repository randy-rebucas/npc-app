import Header from "@/components/header";
import Listings from "@/components/ui/sharetribe/listings";
import { SidebarInset } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/app/actions/user";


export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/auth/signin");
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
        return redirect("/onboarding");
    }
    
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
                    <Listings />
                </div>
            </div>
        </SidebarInset>
    );
}