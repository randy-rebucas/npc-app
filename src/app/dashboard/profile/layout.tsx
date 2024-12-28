'use client';

import Header from "@/components/admin/Header";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();

    const isProfile = pathname.split('/').pop() === 'profile';
    const isBio = pathname.split('/').pop() === 'bio';
    const isPhoto = pathname.split('/').pop() === 'photo';
    const isCalendar = pathname.split('/').pop() === 'calendar';
    const isRates = pathname.split('/').pop() === 'rates';

    const title = isProfile ? 'Profile' : isBio ? 'Bio' : isPhoto ? 'Photo' : isCalendar ? 'Calendar' : 'Rates';
    const tabs = ['Profile', 'Bio', 'Photo', 'Calendar', 'Rates'];

    const breadcrumbs = [
        { label: 'Admin', href: '/admin' },
        {
            label: 'Profile',
            href: '/dashboard/profile',
            active: isProfile,
        },
    ];

    if (isBio) {
        breadcrumbs.push({
            label: 'Bio',
            href: '/dashboard/profile/bio',
            active: isBio,
        });
    }

    if (isPhoto) {
        breadcrumbs.push({
            label: 'Photo',
            href: '/dashboard/profile/photo',
            active: isPhoto,
        });
    }

    if (isCalendar) {
        breadcrumbs.push({
            label: 'Calendar',
            href: '/dashboard/profile/calendar',
            active: isCalendar,
        });
    }

    if (isRates) {
        breadcrumbs.push({
            label: 'Rates',
            href: '/dashboard/profile/rates',
            active: isRates,
        });
    }

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={breadcrumbs} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8 p-8">
                    <div className="flex items-center justify-between space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                            <p className="text-muted-foreground">
                                Manage your profile settings and preferences
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <nav className="flex border-b border-gray-200">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab}
                                    href={`/dashboard/profile${tab.toLowerCase() === 'profile' ? '' : `/${tab.toLowerCase()}`}`}
                                    className={`
                            flex-1 py-4 px-1 text-center border-b-2 
                            ${currentTab === tab.toLowerCase()
                                            ? 'border-blue-500 text-blue-600 font-medium'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                                >
                                    {tab}
                                </Link>
                            ))}
                        </nav>
                        <div className="p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}