'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
// import Link from 'next/link';
import { getUserById, UserDocument } from '@/app/actions/user';
import { signOut, useSession } from 'next-auth/react';

export default function Profile() {
    const { data: session } = useSession();
    const [user, setUser] = useState<Partial<UserDocument> | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (session?.user?.id) {
                const user = await getUserById(session.user.id);
                setUser(user);
            }
        }
        if (session) {
            fetchUser();
        }
    }, [session]);
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-2"
            >
                {user?.profile?.profilePhotoPath ? (
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.profile?.profilePhotoPath} alt={user?.username} />
                        <AvatarFallback className="rounded-lg">{user?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                ) : (
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">{user?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {/* <Link
                            href="/np/profile"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/np/settings"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Settings
                        </Link> */}
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}