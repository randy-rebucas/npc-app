'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { IUser } from '@/app/models/User';
import { IUserProfile } from '@/app/models/UserProfile';
import Picture from '@/components/user/forms/Picture';
import Profile from '@/components/user/forms/Profile';
import User from '@/components/user/forms/User';

export default function ProfilePage() {
    const [profile, setProfile] = useState<IUserProfile & { user: IUser } | null>(null); 

    useEffect(() => {
        const getUser = async () => {
            try {
                // setIsLoading(true);
                const response = await fetch('/api/profile');
                if (!response.ok) {
                    toast({ 
                        title: 'Error',
                        description: 'Failed to fetch profile',
                        variant: 'destructive',
                    });
                    return;
                }
                const responseData = await response.json();
                setProfile(responseData);
            } catch (error) {
                console.error(error);
                toast({
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Failed to load profile data',
                    variant: 'destructive',
                });
            } finally {
                // setIsLoading(false);
            }
        };
        getUser();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {profile && (
                <>
                    {/* User Picture */}
                    <div className="rounded-lg border p-4">
                        <Picture profile={profile} />
                    </div>

                    {/* User Information Section */}
                    <details className="rounded-lg border p-4">
                        <summary className="text-xl font-semibold cursor-pointer">
                            User Information
                        </summary>
                        <div className="mt-4">
                            <User profile={profile} />
                        </div>
                    </details>

                    {/* Profile Information Section */}
                    <details className="rounded-lg border p-4">
                        <summary className="text-xl font-semibold cursor-pointer">
                            Profile Information
                        </summary>
                        <div className="mt-4">
                            <Profile profile={profile} />
                        </div>
                    </details>
                </>
            )}
        </div>
    );
}
