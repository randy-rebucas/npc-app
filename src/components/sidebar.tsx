'use client';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Nav from "./nav"
import { getUser } from "@/app/actions/user";
import { useEffect, useState } from "react";
import { useAuth } from "@/middleware/AuthProvider";
import { IUser } from "@/app/models/User";

export function AppSidebar() {
    const { loading, user } = useAuth();
    const [userData, setUserData] = useState<IUser | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                if (!user?.id) return;
                const userData = await getUser(user.id);
                setUserData(userData);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // Optionally show an error toast/message to user
            }
        };
        getUserData();
    }, [user?.id]);

    if (loading || !userData) return (
        <aside className="flex h-screen w-72 flex-col bg-card/50 backdrop-blur-xl border-r border-border">
            <div className="p-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                <div className="min-w-0 space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                </div>
            </div>
            <Nav />
        </aside>
    );

    const userFullName = userData?.profile 
        ? `${userData.profile.familyName} ${userData.profile.givenName}`.trim()
        : "Loading...";

    return (
        <aside className="flex h-screen w-72 flex-col bg-card/50 backdrop-blur-xl border-r border-border">
            <div className="p-6 flex items-center gap-3">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData?.customData?.profilePhotoPath || ""} alt={userFullName} />
                    <AvatarFallback className="rounded-lg">
                        {userData?.profile?.familyName?.charAt(0) || "?"}
                    </AvatarFallback>
                </Avatar>   
                <div className="min-w-0">
                    <div className="truncate font-semibold text-sm text-foreground">
                        {userFullName}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                        {userData?.primaryEmail || "Loading..."}
                    </div>
                </div>
            </div>

            <Nav/>
        </aside>
    )
}
