'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { getUser, UserDocument } from '@/app/actions/user';
import { useSession } from "@/providers/logto-session-provider";


export default function Profile() {
    const { user, signOut } = useSession();
    const [userData, setUserData] = useState<Partial<UserDocument> | null>(null);
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
            if (user?.id) {
                const userData = await getUser(user.id);
                setUserData(userData);
            }
        }
        if (user) {
            fetchUser();
        }
    }, [user]);
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
                        <button
                            onClick={() => signOut()}
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