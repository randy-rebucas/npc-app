import { GalleryVerticalEnd, LayoutDashboard, Settings, Users, List } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import AdminNavUser from "@/components/admin/NavUser"
import { IConfig } from "@/app/models/Config"

export async function AdminSidebar({ config }: { config: IConfig }) {
    console.log(config);
    // Menu items.
    const items = [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Users",
            url: "/admin/dashboard/users",
            icon: Users,
        },
        {
            title: "Members",
            url: "/admin/dashboard/members",
            icon: Users,
        },
        {
            title: "Event Log",
            url: "/admin/dashboard/event-log",
            icon: List,
        },
        {
            title: "Settings",
            url: "/admin/dashboard/settings",
            icon: Settings,
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">{config.siteName || process.env.NEXT_PUBLIC_APP_NAME}</span>
                                    <span className="">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <AdminNavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
