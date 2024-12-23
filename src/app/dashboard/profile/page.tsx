import Header from "@/components/header";
import Bio from "@/components/ui/profile/bio";
import Calendar from "@/components/ui/profile/calendar";
import Photo from "@/components/ui/profile/photo";
import Profile from "@/components/ui/profile/profile";
import Rates from "@/components/ui/profile/rates";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUserByEmail } from "@/app/actions/user";
import { selectedItem } from "@/lib/utils";
import Tabs from "@/components/tabs";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    const user = session?.user?.email ? await getUserByEmail(session.user.email) : null;

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Please log in to view your profile</p>
            </div>
        );
    }

    const profile = selectedItem(user.profile, ['firstName', 'lastName', 'phone', 'address', 'city', 'state', 'zip']);
    const bio = selectedItem(user.profile, ['description', 'boardCertification', 'linkedinProfile']);
    const photo = selectedItem(user.profile, ['profilePhotoPath', 'firstName', 'lastName']);
    const rates = selectedItem(user.profile, ['monthlyCollaborationRate', 'additionalStateFee', 'additionalNPFee', 'controlledSubstancesMonthlyFee', 'controlledSubstancesPerPrescriptionFee']);

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header 
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Profile', href: '/dashboard/profile', active: true },
                ]} 
            />
            
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Profile</h1>
                </div>
                <Tabs 
                    tabs={['Profile', 'Bio', 'Photo', 'Calendar', 'Rates']}  
                    initialTab="profile"
                    content={[
                        <Profile key="profile" profile={profile} />,
                        <Bio key="bio" bio={bio} />,
                        <Photo key="photo" photo={photo} />,
                        <Calendar key="calendar" />,
                        <Rates key="rates" rates={rates} />
                    ]}
                />
            </main>
        </div>
    );
}
