"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";


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
                toast({
                    title: 'Member migrated',
                    description: 'The member has been migrated',
                    variant: 'default',
                });
            } else {
                toast({
                    title: 'Failed to migrate member',
                    description: data.message,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: 'Failed to migrate member',
                description: 'An unexpected error occurred',
                variant: 'destructive',
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