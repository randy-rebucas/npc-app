'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuth } from "@/middleware/AuthProvider";
import { useEffect, useState } from "react";
import { getUser } from "@/app/actions/user";
import { IUser } from "@/app/models/User";

export default function FooterUser() {
    const { user } = useAuth(); 
    const [userData, setUserData] = useState<IUser | null>(null);

    useEffect(() => {
        console.log(user);
        const getUserData = async () => {
            const userData = await getUser(user?.id as string);
            setUserData(userData);
        }
        getUserData();
    }, [user]);
    
    return (
        <>
            <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData?.avatar?.toString() || ""} alt={userData?.username?.toString() || ""} />
                <AvatarFallback className="rounded-lg bg-muted-foreground/10">
                    {userData?.username?.toString().charAt(0) || ""}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">{userData?.profile?.givenName}</span>
                <span className="truncate text-xs text-muted-foreground">{userData?.primaryEmail}</span>
            </div>
        </>
    );
}


