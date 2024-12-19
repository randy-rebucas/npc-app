import { getUserByEmail } from "@/app/actions/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Header from "@/components/header";
import Certifications from "@/components/ui/credentials/certifications";
import Education, { Education as EducationType } from "@/components/ui/credentials/education";
import GovID from "@/components/ui/credentials/govId";
import Licenses, { License } from "@/components/ui/credentials/licenses";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectedItem } from "@/lib/utils";
import { getServerSession } from "next-auth";


export default async function CredentialsPage() {
    // Get session
    const session = await getServerSession(authOptions);

    // Add user fetch using server action
    const user = session?.user?.email ? await getUserByEmail(session.user.email) : null;

    // Select the profile fields
    const licenses = selectedItem(user.profile, ['medicalLicenseStates', 'deaLicenseStates']) as License[];
    const certifications = selectedItem(user.profile, ['additionalCertifications', 'boardCertification', 'npiNumber']);
    const education = selectedItem(user.profile, ['education']);
    const govId = selectedItem(user.profile, ['governmentIdUrl']);

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
                            <Licenses licenses={licenses} />
                        </TabsContent>
                        <TabsContent value="certifications">
                            <Certifications certifications={certifications} />
                        </TabsContent>
                        <TabsContent value="education">
                            <Education education={education as EducationType} />
                        </TabsContent>
                        <TabsContent value="gov-id">
                            <GovID govId={govId} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </SidebarInset>
    );
}