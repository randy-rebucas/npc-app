import AdminHeader from "@/components/admin/Header";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsLayout({
    children,
    profile,
    password,
    application,
    notification,
}: {
    children: React.ReactNode,
    profile: React.ReactNode,
    password: React.ReactNode,
    application: React.ReactNode,
    notification: React.ReactNode,
}) {
    return (
        <SidebarInset>
            <AdminHeader breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                {
                    label: 'Settings',
                    href: '/admin/settings',
                    active: true,
                },
            ]} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {children}
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="application">Application</TabsTrigger>
                        <TabsTrigger value="notification">Notifications</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        {profile}
                    </TabsContent>
                    <TabsContent value="application">
                        {application}
                    </TabsContent>
                    <TabsContent value="notification">
                        {notification}
                    </TabsContent>
                    <TabsContent value="password">
                        {password}
                    </TabsContent>
                </Tabs>
            </div>
        </SidebarInset>
    );
}