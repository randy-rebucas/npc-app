'use client'

import { useEffect, useState } from 'react';
import memberstack from '@memberstack/dom';

interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    auth: {
        email: string;
    };
}

export function Memberstack() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Initialize Memberstack
        memberstack.init({
            publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || '',
        });

        const fetchAllUsers = async () => {
            try {
                // You'll need to make this request from your backend
                const response = await fetch('http://localhost:3000/api/members', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response);
                const data = await response.json();
                setUsers(data.members);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchAllUsers();
    }, []);

    return (
        <div>
            <h1>Memberstack</h1>
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">All Members</h1>
                <div className="grid gap-4">
                    {users.map((user) => (
                        <div key={user.id} className="p-4 border rounded-lg">
                            <p>Email: {user.auth?.email || user.email}</p>
                            <p>Name: {user.name}</p>
                            <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}