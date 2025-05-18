'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { getUser } from '@/app/actions/user';
import { IUser } from '@/app/models/User';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/middleware/AuthProvider';

export default function Profile() {
    const { loading: authLoading, user, handleLogout } = useAuth(); 
    const [userData, setUserData] = useState<Partial<IUser> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
                setIsLoading(true);
                try {
                    const userData = await getUser(user.id);
                    setUserData(userData);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        if (user?.id) {
            fetchUser();
        }
    }, [user?.id]);
    
    if (authLoading || isLoading) {
        return (
            <div className="relative" ref={dropdownRef}>
                <Button variant="ghost" disabled>
                    <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </Button>
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
            >
                {userData?.customData?.profilePhotoPath ? (
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={userData?.customData?.profilePhotoPath} alt={userData?.username} />
                        <AvatarFallback className="rounded-lg">{userData?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                ) : (
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarFallback className="rounded-lg">{userData?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <button
                            onClick={() => handleLogout()}
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