'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSession } from "@/providers/logto-session-provider";

export default function FooterUser() {
    const { user } = useSession();

    return (
        <>
            <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar?.toString() || ""} alt={user?.username?.toString() || ""} />
                <AvatarFallback className="rounded-lg bg-muted-foreground/10">
                    {user?.username?.toString().charAt(0) || ""}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">{user?.username}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
            </div>
        </>
    );
}


