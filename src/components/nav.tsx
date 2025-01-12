"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from 'lucide-react'
import { Key, User, LayoutDashboard, Shield, HelpCircle, CreditCardIcon, FileCheck, Settings } from "lucide-react"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// Add type for navigation items
type NavItem = {
    title: string
    url: string
    icon: LucideIcon
}

export default function Nav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [items, setItems] = useState<NavItem[]>([
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Profile",
            url: "/dashboard/profile",
            icon: User,
        },
        {
            title: "Credentials",
            url: "/dashboard/credentials",
            icon: Key,
        },
        {
            title: "Help",
            url: "/dashboard/help",
            icon: HelpCircle,
        }
    ]);

    // Use useEffect to fetch user data and update items once when component mounts
    useEffect(() => {
        const fetchUser = async () => {
            if (!session?.user?.id) return;

            const response = await fetch(`/api/user/${session.user.id}`);
            const user = await response.json();
            console.log(user);
            if (user?.metaData?.validated === true) {
                setItems(currentItems => [
                    ...currentItems,
                    {
                        title: "Stripe",
                        url: "/dashboard/stripe",
                        icon: CreditCardIcon,
                    },
                    {
                        title: "Attestations",
                        url: "/dashboard/attestations",
                        icon: FileCheck,
                    },
                    {
                        title: "Settings",
                        url: "/dashboard/settings",
                        icon: Settings,
                    }
                ]);
            }

            if (user?.role === "ADMIN") {
                setItems(currentItems => [
                    ...currentItems,
                    {
                        title: "Admin",
                        url: "/dashboard/admin",
                        icon: Shield,
                    }
                ]);
            }
        };

        fetchUser();
    }, [session?.user?.id]); // Only re-run if user ID changes

    return (
        <nav className="flex-1 space-y-6 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
            <div className="space-y-1.5">
                <h2 className="mb-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Navigation
                </h2>
                {items.map((item) => (
                    <Link
                        key={item.title}
                        href={item.url}
                        className={cn("group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50", pathname === item.url && "bg-gray-100 dark:bg-gray-800/50")}
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:group-hover:text-white">
                            <item.icon className="size-4" />
                        </div>
                        <span className="transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {item.title}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    )
}