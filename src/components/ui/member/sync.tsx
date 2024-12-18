'use client'

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Sync({ id }: { id: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSync = async () => {
        setIsLoading(true);
        try {
            // Send the formData to the server
            const response = await fetch('/api/sharetribe', {
                method: 'POST',
                body: JSON.stringify({ id }),
            });

            // Check if the response is ok
            if (!response.ok) throw new Error('Submission failed');

            toast({
                title: 'Member synced to Sharetribe',
                description: 'Member synced to Sharetribe',
            });

            // Redirect to the home page
            router.push('/dashboard/members/webhook');
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error',
                description: 'Error syncing member to Sharetribe',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button 
            variant="outline" 
            size="icon" 
            onClick={handleSync}
            disabled={isLoading}
        >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
    );
}