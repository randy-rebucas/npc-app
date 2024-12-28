'use client';

import { usePathname } from "next/navigation";
import Header from "@/components/admin/Header";
import Link from "next/link";


export default function CredentialsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();

    const isCredentials = pathname.split('/').pop() === 'credentials';
    const isEducation = pathname.split('/').pop() === 'education';
    const isGovid = pathname.split('/').pop() === 'govid';
    const isCertification = pathname.split('/').pop() === 'certification';

    const title = isCredentials ? 'Credentials' : isEducation ? 'Education' : isGovid ? 'Govid' : isCertification ? 'Certification' : 'Credentials';
    const tabs = ['Credentials', 'Education', 'Govid', 'Certification'];

    const breadcrumbs = [
        { label: 'Admin', href: '/admin' },
        {
            label: 'Credentials',
            href: '/dashboard/credentials',
            active: isCredentials,
        },
    ];

    if (isCertification) {
        breadcrumbs.push({
            label: 'Certification',
            href: '/dashboard/credentials/certification',
            active: isCertification,
        });
    }

    if (isEducation) {
        breadcrumbs.push({
            label: 'Education',
            href: '/dashboard/credentials/education',
            active: isEducation,
        });
    }

    if (isGovid) {
        breadcrumbs.push({
            label: 'Govid',
            href: '/dashboard/credentials/govid',
            active: isGovid,
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
                                    href={`/dashboard/credentials${tab.toLowerCase() === 'credentials' ? '' : `/${tab.toLowerCase()}`}`}
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