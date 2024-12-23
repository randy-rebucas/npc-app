import { getMedicalLicenseStates } from "@/app/actions/medicallicensestates";
import { getPracticeTypes } from "@/app/actions/practicetypes";
import { getUserByEmail } from "@/app/actions/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Header from "@/components/header";
import Tabs from "@/components/tabs";
import Certifications from "@/components/ui/credentials/certifications";
import Education from "@/components/ui/credentials/education";
import GovID from "@/components/ui/credentials/govId";
import Licenses from "@/components/ui/credentials/licenses";
import { selectedItem } from "@/lib/utils";
import { getServerSession } from "next-auth";


export default async function CredentialsPage() {
    const session = await getServerSession(authOptions);
    const user = session?.user?.email ? await getUserByEmail(session.user.email) : null;

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Please log in to view your credentials</p>
            </div>
        );
    }

    // Select the profile fields
    const licenses = selectedItem(user.profile, ['medicalLicenseStates', 'deaLicenseStates']);
    const certifications = selectedItem(user.profile, ['additionalCertifications', 'boardCertification', 'npiNumber']);
    const educations = selectedItem(user.profile, ['education', 'clinicalDegree', 'practiceTypes']);
    const govId = selectedItem(user.profile, ['governmentIdPath']);

    const medicalLicenseStates = await getMedicalLicenseStates();
    const practiceTypes = await getPracticeTypes();
    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header 
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Credentials', href: '/dashboard/credentials', active: true },
                ]} 
            />
            
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Credentials</h1>
                </div>
                <Tabs    
                    tabs={['License', 'Certifications', 'Education', 'Gov ID']}
                    initialTab="license"
                    content={[
                        <Licenses 
                            key="license"
                            medicalLicenseStates={licenses.medicalLicenseStates} 
                            deaLicenseStates={licenses.deaLicenseStates} 
                            states={medicalLicenseStates} 
                        />,
                        <Certifications 
                            key="certifications"
                            boardCertification={certifications.boardCertification} 
                            additionalCertifications={certifications.additionalCertifications} 
                            npiNumber={certifications.npiNumber}
                        />,
                        <Education 
                            key="education"
                            education={educations.education} 
                            clinicalDegree={educations.clinicalDegree} 
                            practiceTypes={educations.practiceTypes} 
                            practices={practiceTypes}
                        />,
                        <GovID 
                            key="gov-id"
                            govId={govId} 
                        />
                    ]}
                />
            </main>
        </div>
    );
}