'use client'

import Header from "@/components/header";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();

    const tabs = ['Settings', 'Profile', 'Appearance', 'Notifications'];
    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab}
                                    href={`/np/settings${tab.toLowerCase() === 'settings' ? '' : `/${tab.toLowerCase().replace(/\s+/g, '-')}`}`}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                            ${currentTab === tab.toLowerCase().replace(/\s+/g, '-')
                                            ? 'border-blue-500 text-blue-600'

                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} `} >
                                    {tab}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="rounded-lg p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>

    )
}
