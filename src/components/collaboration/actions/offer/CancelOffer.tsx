'use client';

import { toast } from "sonner";


export default function CancelOffer({ collaboratorId, refetchAction }: { collaboratorId: string, refetchAction: () => void }) {

    const handleCancelOffer = async (id: string) => {
        try {
            const response = await fetch(`/api/collaborators/${id}/offer/cancel`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Offer cancelled', {
                    description: 'The offer has been cancelled',
                });
                refetchAction();
            } else {
                toast.error('Failed to cancel offer', {
                    description: data.message,
                });
            }
        } catch (err) {
            console.error('Error cancelling offer:', err);
            toast.error('Failed to cancel offer', {
                description: 'Please try again later.',
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
