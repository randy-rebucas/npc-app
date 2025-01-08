import { GalleryVerticalEnd } from "lucide-react"

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

import { getConfigValue } from "@/app/actions/config"
import MenuItems from "./MenuItems"
export async function AdminSidebar() {

    // Menu items.
    const items = [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: "dashboard",
        },
        {
            title: "Users",
            url: "/admin/dashboard/users",
            icon: "users",
        },
        {
            title: "Members",
            url: "/admin/dashboard/members",
            icon: "users",
        },
        {
            title: "Event Log",
            url: "/admin/dashboard/event-log",
            icon: "list",
        },
        {
            title: "FAQ",
            url: "/admin/dashboard/faq",
            icon: "faq",
        },
        {
            title: "Help",
            url: "/admin/dashboard/help",
            icon: "help",
        },
        {
            title: "Transactions",
            url: "/admin/dashboard/transactions",
            icon: "transactions",
        },
        {
            title: "Miscellaneous",
            url: "/admin/dashboard/miscellaneous",
            icon: "miscellaneous",
        },
        {
            title: "Settings",
            url: "/admin/dashboard/settings",
            icon: "settings",
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
                                    <span className="font-semibold">{await getConfigValue("siteName") || process.env.NEXT_PUBLIC_APP_NAME}</span>
                                    <span className="">v{await getConfigValue("appVersion") || process.env.NEXT_PUBLIC_APP_VERSION}</span>
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
                        <MenuItems items={items} />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <AdminNavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
