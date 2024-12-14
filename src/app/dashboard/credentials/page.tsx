import Header from "@/components/header";
import Certifications from "@/components/ui/credentials/certifications";
import Education from "@/components/ui/credentials/education";
import GovID from "@/components/ui/credentials/govId";
import Licenses from "@/components/ui/credentials/licenses";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function CredentialsPage() {
    return (
        <SidebarInset>
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                {
                    label: 'Credentials',
                    href: '/dashboard/credentials',
                    active: true,
                },
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Credentials</h1>
                    </div>
                    <Tabs defaultValue="license" className="max-w-2xl">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="license">License</TabsTrigger>
                            <TabsTrigger value="certifications">Certifications</TabsTrigger>
                            <TabsTrigger value="education">Education</TabsTrigger>
                            <TabsTrigger value="gov-id">Gov ID</TabsTrigger>
                        </TabsList>
                        <TabsContent value="license">
                            <Licenses />
                        </TabsContent>
                        <TabsContent value="certifications">
                            <Certifications />
                        </TabsContent>
                        <TabsContent value="education">
                            <Education />
                        </TabsContent>
                        <TabsContent value="gov-id">
                            <GovID />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </SidebarInset>
    );
}