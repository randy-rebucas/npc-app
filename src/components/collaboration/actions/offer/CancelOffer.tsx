'use client';

import { toast } from "@/hooks/use-toast";


export default function CancelOffer({ collaboratorId, refetch }: { collaboratorId: string, refetch: () => void }) {

    const handleCancelOffer = async (id: string) => {
        try {
            const response = await fetch(`/api/collaborators/${id}/offer/cancel`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: 'Offer cancelled',
                    description: 'The offer has been cancelled',
                    variant: 'default',
                });
                refetch();
            } else {
                toast({
                    title: 'Failed to cancel offer',
                    description: data.message,
                    variant: 'destructive',
                });
            }
        } catch (err) {
            console.error('Error cancelling offer:', err);
            toast({
                title: 'Failed to cancel offer',
                description: 'Please try again later.',
                variant: 'destructive',
            });
        }
    };

    return (
        <button
            onClick={() => handleCancelOffer(collaboratorId)}
            className="flex-1 bg-destructive/10 text-destructive border border-destructive/30 rounded-md py-2 px-4 text-sm font-medium hover:bg-destructive/20"
        >
            Cancel Offer
        </button>
    );
}
