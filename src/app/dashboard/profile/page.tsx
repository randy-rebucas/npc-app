import Header from "@/components/header";
import Bio from "@/components/ui/profile/bio";
import Calendar from "@/components/ui/profile/calendar";
import Photo from "@/components/ui/profile/photo";
import Profile from "@/components/ui/profile/profile";
import Rates from "@/components/ui/profile/rates";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
    return (
        <SidebarInset>
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' },
                {
                    label: 'Profile',
                    href: '/dashboard/profile',
                    active: true,
                },
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Credentials</h1>
                    </div>
                    <Tabs defaultValue="profile" className="max-w-2xl">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="bio">Bio</TabsTrigger>
                            <TabsTrigger value="photo">Photo</TabsTrigger>
                            <TabsTrigger value="calendar">Calendar</TabsTrigger>
                            <TabsTrigger value="rates">Rates</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile">
                            <Profile />
                        </TabsContent>
                        <TabsContent value="bio">
                            <Bio />
                        </TabsContent>
                        <TabsContent value="photo">
                            <Photo />
                        </TabsContent>
                        <TabsContent value="calendar">
                            <Calendar />
                        </TabsContent>
                        <TabsContent value="rates">
                            <Rates />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </SidebarInset>
    );
}
