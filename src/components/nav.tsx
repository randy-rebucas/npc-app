"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from 'lucide-react'
import { Key, User, HelpCircle, CreditCardIcon, FileCheck, Settings, Users, Search, Heart, File } from "lucide-react"
import { useState, useEffect } from "react";
import { IUser } from "@/app/models/User";
import { useAuth } from "@/middleware/AuthProvider";
import { getUser } from "@/app/actions/user";

type NavItem = {
    title: string
    url: string
    icon: LucideIcon
}

export default function Nav() {
    const pathname = usePathname();
    const { user } = useAuth(); 
    const [userData, setUserData] = useState<IUser | null>(null);
    const [items, setItems] = useState<NavItem[]>([]);

    useEffect(() => {
        const getUserData = async (userId: string) => {
            try {
                const user = await getUser(userId);
                setUserData(user);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // Optionally show an error toast/message to user
            }
        }
        if (user?.id) {
            getUserData(user.id);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!userData) return;

        const populateItems = () => {
            const newItems: NavItem[] = [];

            // Common items for physicians
            if (userData?.customData?.role === "physician") {
                newItems.push(
                    { title: "Profile", url: "/np/profile", icon: User },
                    { title: "Credentials", url: "/np/credentials", icon: Key },
                    { title: "Settings", url: "/np/settings", icon: Settings },
                    { title: "Help", url: "/np/help", icon: HelpCircle }
                );

                // Additional items for approved physicians
                if (userData?.customData?.submissionStatus === "APPROVED") {
                    newItems.push(
                        { title: "Collaborators", url: "/np/collaborators", icon: Users },
                        // { title: "Messages", url: "/np/messages", icon: MessageCircle },
                        { title: "Stripe", url: "/np/stripe", icon: CreditCardIcon },
                        { title: "Attestations", url: "/np/attestations", icon: FileCheck }
                    );
                }
            }

            // Items for nurse practitioners
            if (userData?.customData?.role === "nurse-practitioner") {
                newItems.push(
                    { title: "Find Match", url: "/np/find-match", icon: Search },
                    // { title: "Messages", url: "/np/messages", icon: MessageCircle },
                    { title: "Favorites", url: "/np/favorites", icon: Heart },
                    { title: "Settings", url: "/np/settings", icon: Settings },
                    { title: "Help", url: "/np/help", icon: HelpCircle }
                );
            }

            // Optional listing item
            if (userData?.customData?.canCreateListings) {
                newItems.push({
                    title: "Listings",
                    url: "/np/listings",
                    icon: File,
                });
            }

            setItems(newItems);
        };

        populateItems();
    }, [userData]); // Remove items from dependency array

    return (
        <nav className="flex-1 space-y-6 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
            aria-label="Main navigation">
            <div className="space-y-1.5">
                <h2 className="mb-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Navigation
                </h2>
                {items.map((item, index) => (
                    <Link
                        key={index}
                        href={item.url}
                        className={cn(
                            "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50",
                            pathname === item.url && "bg-gray-100 dark:bg-gray-800/50"
                        )}
                        aria-current={pathname === item.url ? "page" : undefined}
                    >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:group-hover:text-white">
                            <item.icon className="size-4" aria-hidden="true" />
                        </div>
                        <span className="transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {item.title}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}