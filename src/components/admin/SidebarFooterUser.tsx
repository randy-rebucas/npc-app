import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import { SidebarMenu } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getUserByEmail } from "@/app/actions/user";

export default async function AdminSidebarFooterUser() {
    // Get session
    const session = await getServerSession(authOptions);
    // Add user fetch using server action
    const user = session?.user?.email ? await getUserByEmail(session.user.email) : null;
    
    return (
        <SidebarMenu className="bg-muted">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="hover:bg-muted-foreground/10 data-[state=open]:bg-muted-foreground/10"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user?.profile?.profilePhotoPath} alt={user?.username} />
                                <AvatarFallback className="rounded-lg bg-muted-foreground/10">
                                    {user?.username?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold text-foreground">{user?.username}</span>
                                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}