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
  children: React.ReactNode;
  profile: React.ReactNode;
  password: React.ReactNode;
  application: React.ReactNode;
  notification: React.ReactNode;
}) {
  return (
    <SidebarInset>
      <AdminHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          {
            label: "Settings",
            href: "/admin/settings",
            active: true,
          },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4">
        {children}
        <Tabs defaultValue="application" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notification">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="application">{application}</TabsContent>
          <TabsContent value="profile">{profile}</TabsContent>
          <TabsContent value="password">{password}</TabsContent>
          <TabsContent value="notification">{notification}</TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
}
