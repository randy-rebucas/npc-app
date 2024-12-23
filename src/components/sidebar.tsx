import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { getUserByEmail } from "@/app/actions/user"

import Nav from "./nav"

export async function AppSidebar() {
    const session = await getServerSession(authOptions)
    const user = session?.user?.email ? await getUserByEmail(session.user.email) : null

    

    return (
        <aside className="flex h-screen w-72 flex-col bg-white/50 backdrop-blur-xl border-r border-gray-200/50 dark:bg-gray-900/50 dark:border-gray-800/50">
            {/* Header */}
            <div className="p-6 flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.profile?.profilePhotoPath} alt={user?.username} />
                    <AvatarFallback className="rounded-lg">{user?.username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <div className="truncate font-semibold text-sm">{user?.username}</div>
                    <div className="truncate text-xs text-gray-700 dark:text-gray-300">{user?.email}</div>
                </div>
            </div>

            {/* Navigation */}
            <Nav />
        </aside>
    )
}
