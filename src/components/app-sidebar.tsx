import { GalleryVerticalEnd, HelpCircle, Key, Settings, User, LayoutDashboard } from "lucide-react"

export function AppSidebar() {
    const items = [
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
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
        },
    ]

    return (
        <aside className="flex h-screen w-72 flex-col bg-white/50 backdrop-blur-xl border-r border-gray-200/50 dark:bg-gray-900/50 dark:border-gray-800/50">
            {/* Header */}
            <div className="p-6">
                <a href="#" className="group flex items-center gap-4 px-2">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20 transition-all duration-300 group-hover:shadow-primary-500/30 group-hover:scale-105">
                        <GalleryVerticalEnd className="size-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">
                            {process.env.NEXT_PUBLIC_APP_NAME}
                        </span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            v{process.env.NEXT_PUBLIC_APP_VERSION}
                        </span>
                    </div>
                </a>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-6 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                <div className="space-y-1.5">
                    <h2 className="mb-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Navigation
                    </h2>
                    {items.map((item) => (
                        <a
                            key={item.title}
                            href={item.url}
                            className="group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
                        >
                            <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-primary-500 group-hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:group-hover:text-white">
                                <item.icon className="size-4" />
                            </div>
                            <span className="transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                {item.title}
                            </span>
                        </a>
                    ))}
                </div>
            </nav>
        </aside>
    )
}
