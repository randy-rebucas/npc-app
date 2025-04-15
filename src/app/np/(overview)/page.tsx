'use client';

import { useSession } from "@/providers/logto-session-provider";
import { useEffect, useState } from "react";
import { IUser } from "@/app/models/User";
import { getUser } from "@/app/actions/user";
import { redirect } from "next/navigation";

export default function Dashboard() {
    const { claims } = useSession();
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            const user = await getUser(claims.sub as string);
            setUser(user);
        }
        getUserData();
    }, [claims.sub]);

    useEffect(() => {
        if(user && user?.customData?.hasOwnProperty("role")) {
            if (user?.customData?.role === "nurse-practitioner") {
                redirect("/np/find-match"); 
            } else if (user?.customData?.role === "physician") {
                redirect("/np/main");
            } else if (user?.customData?.role === "admin") {
                redirect("/admin");
            }
        } else {
            redirect("/onboarding");
        }

    }, [user]);

    return (
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Welcome to your dashboard!
                </p>
            </div>
        </div>
    );
}