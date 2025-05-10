"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function Migrate({ id }: { id: string }) {
    // Add loading state
    const [isLoading, setIsLoading] = useState(false);

    const handleMigrate = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/members/${id}/migrate`, {
                method: 'POST',
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Member migrated', {
                    description: 'The member has been migrated',
                });
            } else {
                toast.error('Failed to migrate member', {
                    description: data.message,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to migrate member', {
                description: 'An unexpected error occurred',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            onClick={() => handleMigrate(id)} 
            disabled={isLoading}
        >
            {isLoading ? 'Migrating...' : 'Migrate'}
        </Button>
    );
}