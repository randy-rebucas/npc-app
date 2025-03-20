"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from 'lucide-react'
import { Key, User, HelpCircle, CreditCardIcon, FileCheck, Settings, MessageCircle, Users, Search, Heart, File } from "lucide-react"
import { useSession } from "@/providers/logto-session-provider";
import { useState, useEffect } from "react";

// Move this to src/types/navigation.ts
type NavItem = {
    title: string
    url: string
    icon: LucideIcon
}

function useNavigationItems() {
    const { user } = useSession();
    const [items, setItems] = useState<NavItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/user/${user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                
                const newItems: NavItem[] = [];

                if (userData?.role === "PHYSICIAN") {
                    newItems.push(
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
                    );
                }

                if (userData?.role === "PHYSICIAN" && userData?.submissionStatus === "APPROVED") {
                    newItems.push(
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
                        }
                    );
                }

                if (userData?.role === "NURSE_PRACTITIONER") {
                    newItems.push(
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
                    );
                }

                if (userData?.canCreateListings) {
                    newItems.push({
                        title: "Listings",
                        url: "/np/listings",  
                        icon: File,
                    });
                }

                setItems(newItems);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
        }, [user]);

    return { items, isLoading, error };
}

export default function Nav() {
    const pathname = usePathname();
    const { items, isLoading, error } = useNavigationItems();

    if (error) {
        return (
            <nav className="flex-1 p-4">
                <div className="text-red-500">Error loading navigation: {error}</div>
            </nav>
        );
    }

    if (isLoading) {
        return (
            <nav className="flex-1 p-4">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded-xl dark:bg-gray-800" />
                    ))}
                </div>
            </nav>
        );
    }

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