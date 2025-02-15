import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar"

import AdminSidebarFooterUser from "@/components/admin/SidebarFooterUser"

import MenuItems from "./MenuItems"
import { AdminSidebarHeaderContent } from "./SidebarHeaderContent"

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
            title: "Listings",
            url: "/admin/dashboard/listings",
            icon: "listings",
        },
        {
            title: "Offers",
            url: "/admin/dashboard/offers",
            icon: "offers",
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
                <AdminSidebarHeaderContent />
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
                <AdminSidebarFooterUser />
            </SidebarFooter>
        </Sidebar>
    )
}
