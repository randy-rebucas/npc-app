"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from 'lucide-react'
import { HelpCircle, Key, User, LayoutDashboard, Settings, CreditCard, FileCheck } from "lucide-react"

// Add type for navigation items
type NavItem = {
    title: string
    url: string
    icon: LucideIcon
}

export default function Nav() {
    const pathname = usePathname()

    const items: NavItem[] = [
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
            title: "Payment",
            url: "/dashboard/payment",
            icon: CreditCard,
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
        },
        {
            title: "Help",
            url: "/dashboard/help",
            icon: HelpCircle,
        }
    ]

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