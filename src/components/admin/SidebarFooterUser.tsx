import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import { SidebarMenu } from "@/components/ui/sidebar";
import FooterUser from "./FooterUser";

export default async function AdminSidebarFooterUser() {

    return (
        <SidebarMenu className="bg-muted">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="hover:bg-muted-foreground/10 data-[state=open]:bg-muted-foreground/10"
                        >
                            <FooterUser />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}