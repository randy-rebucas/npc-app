'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { IUser } from '@/app/models/User';
import Picture from '@/components/user/forms/Picture';
import Profile from '@/components/user/forms/Profile';
import User from '@/components/user/forms/User';

export default function ProfilePage() {
    const [user, setUser] = useState< IUser | null>(null); 

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
                console.log(responseData);
                setUser(responseData);
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
    console.log(user);
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {user && (
                <>
                    {/* User Picture */}
                    <div className="rounded-lg border bg-card p-4">
                        <Picture user={user} />
                    </div>

                    {/* User Information Section */}
                    <details className="rounded-lg border bg-card p-4">
                        <summary className="text-xl font-semibold cursor-pointer text-foreground">
                            User Information
                        </summary>
                        <div className="mt-4">
                            <User user={user} />
                        </div>
                    </details>

                    {/* Profile Information Section */}
                    <details className="rounded-lg border bg-card p-4">
                        <summary className="text-xl font-semibold cursor-pointer text-foreground">
                            Profile Information
                        </summary>
                        <div className="mt-4">
                            <Profile user={user} />
                        </div>
                    </details>
                </>
            )}
        </div>
    );
}
