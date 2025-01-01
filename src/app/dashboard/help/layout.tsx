'use client';

import Header from "@/components/header";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HelpLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.split('/').pop();

    const isHelp = pathname.split('/').pop() === 'help';
    const isFaq = pathname.split('/').pop() === 'faq';
    const isContactUs = pathname.split('/').pop() === 'contactus';

    const title = isFaq ? 'FAQ' : isContactUs ? 'Contact Us' : 'Help';
    const tabs = ['FAQ', 'Contact Us'];

    const breadcrumbs = [
        { label: 'Dashboard', href: '/dashboard' },
        {
            label: 'Help',
            href: '/dashboard/help',
            active: isHelp,
        },
    ];

    if (isFaq) {
        breadcrumbs.push({
            label: 'FAQ',
            href: '/dashboard/help/faq',
            active: isFaq,
        });
    }

    if (isContactUs) {
        breadcrumbs.push({
            label: 'Contact Us',
            href: '/dashboard/help/contactus',
            active: isContactUs,
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
                                Get help with your account and features
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <nav className="flex border-b border-gray-200">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab}
                                    href={`/dashboard/help${tab.toLowerCase() === 'faq' ? '' : `/${tab.toLowerCase().replace(/\s+/g, '')}`}`}
                                    className={`
                            flex-1 py-4 px-1 text-center border-b-2 
                            ${currentTab === tab.toLowerCase().replace(/\s+/g, '')
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
                            {modal}
                        </div>
                    </div>
                </div>
            </main>   
        </div>
    );
}