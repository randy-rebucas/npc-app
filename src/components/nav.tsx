"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from 'lucide-react'
import { Key, User, HelpCircle, CreditCardIcon, FileCheck, Settings, MessageCircle, Users, Search, Heart, File } from "lucide-react"
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
    const [items, setItems] = useState<NavItem[]>([]);

    // Use useEffect to fetch user data and update items once when component mounts
    useEffect(() => {
        const fetchUser = async () => {
            if (!session?.user?.id) return;

            const response = await fetch(`/api/user/${session.user.id}`);
            const user = await response.json();
            if (user?.role === "PHYSICIAN") {
                setItems(currentItems => [
                    ...currentItems,
                    {
                        title: "Profile",
                        url: "/np/profile",
                        icon: User,
                    },
                    {
                        title: "Credentials",
                        url: "/np/credentials",
                        icon: Key,
                    },
                    {
                        title: "Settings",
                        url: "/np/settings",
                        icon: Settings,
                    },
                    {
                        title: "Help",
                        url: "/np/help",
                        icon: HelpCircle,
                    }
                ]);
            }

            if (user?.canCreateListings) {
                setItems(currentItems => [
                    ...currentItems,
                    {
                        title: "Listings",
                        url: "/np/listings",  
                        icon: File,
                    }
                ]);
            }
            

            if (user?.role === "PHYSICIAN" && user?.submissionStatus === "APPROVED") {
                setItems(currentItems => [
                    ...currentItems,
                    {
                        title: "Collaborators",
                        url: "/np/collaborators",
                        icon: Users,
                    },
                    {
                        title: "Messages",
                        url: "/np/messages",
                        icon: MessageCircle,
                    },
                    {
                        title: "Stripe",
                        url: "/np/stripe",
                        icon: CreditCardIcon,
                    },
                    {
                        title: "Attestations",
                        url: "/np/attestations",
                        icon: FileCheck,
                    },
                ]);
            }

            if (user?.role === "NURSE_PRACTITIONER") {
                setItems(currentItems => [
                    ...currentItems,
                    {
                        title: "Find Match",
                        url: "/np/find-match",
                        icon: Search, 
                    },
                    {
                        title: "Messages",
                        url: "/np/messages",
                        icon: MessageCircle,
                    },
                    {
                        title: "Favorites",
                        url: "/np/favorites",
                        icon: Heart,
                    },
                    {
                        title: "Settings",
                        url: "/np/settings",
                        icon: Settings,
                    },
                    {
                        title: "Help",
                        url: "/np/help",
                        icon: HelpCircle,
                    }
                ]);
            }

            if (user?.role === "NURSE_PRACTITIONER" && user?.submissionStatus === "APPROVED") {
                setItems(currentItems => [
                    ...currentItems,
                    {
                        title: "Collaborators",
                        url: "/np/collaborators",
                        icon: Users,
                    },
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
                {items.map((item, index) => (
                    <Link
                        key={index}
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