import { SignOut } from "./signout";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

import { SidebarMenu } from "./ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ChevronsUpDown } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByEmail } from "@/app/actions/user";

export default async function NavUser() {
    // Get session
    const session = await getServerSession(authOptions);
    // Add user fetch using server action
    const user = session?.user?.email ? await getUserByEmail(session.user.email) : null;

    return (
        <SidebarMenu className="bg-popover">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user?.profile?.profilePhotoUrl} alt={user?.username} />
                                <AvatarFallback className="rounded-lg">{user?.username?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user?.username}</span>
                                <span className="truncate text-xs">{user?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        className="w-[--radix-popper-anchor-width]"
                    >
                        <DropdownMenuItem>
                            <span>Account</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <SignOut />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}