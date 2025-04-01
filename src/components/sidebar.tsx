import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import Nav from "./nav"

export async function AppSidebar() {
    
    const { claims } = await getLogtoContext(logtoConfig, { fetchUserInfo: true });
    // const user = claims?.sub ? await getUserByEmail(claims.sub) : null
    const user = {
        username: claims?.name,
        email: claims?.email,
        profilePhotoPath: claims?.picture,
    }
    return (
        <aside className="flex h-screen w-72 flex-col bg-card/50 backdrop-blur-xl border-r border-border">
            {/* Header */}
            <div className="p-6 flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.profilePhotoPath || ""} alt={user?.username || ""} />
                    <AvatarFallback className="rounded-lg">{user?.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <div className="truncate font-semibold text-sm text-foreground">{user?.username}</div>
                    <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
                </div>
            </div>

            {/* Navigation */}
            <Nav />
        </aside>
    )
}
