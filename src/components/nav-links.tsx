'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
    const pathname = usePathname();

    const links = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Members', href: '/dashboard/members' },
    ];

    return (
        <div className="flex items-center gap-4">
            {links.map((link) => (
                <Link href={link.href} key={link.href} className={clsx(
                    'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:underline hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                    {
                        'text-blue-600 underline': pathname === link.href,
                    }
                )}>{link.label}</Link>
            ))}
        </div>
    );
}
