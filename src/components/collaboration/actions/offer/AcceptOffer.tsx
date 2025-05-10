'use client';

import { toast } from "sonner"; 


export default function AcceptOffer({ collaboratorId, refetchAction }: { collaboratorId: string, refetchAction: () => void }) {

    const handleAcceptOffer = async (id: string) => {
        try {
            const response = await fetch(`/api/collaborators/${id}/offer/accept`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Offer accepted', {
                    description: 'The offer has been accepted',
                });
                refetchAction();
            } else {
                toast.error('Failed to accept offer', {
                    description: data.message,
                });
            }
        } catch (err) {
            console.error('Error accepting offer:', err);
            toast.error('Failed to accept offer', {
                description: 'Please try again later.',
            });
        }
    };

    return (
        <button
            onClick={() => handleAcceptOffer(collaboratorId)}
            className="flex-1 bg-success/10 text-success border border-success/30 rounded-md py-2 px-4 text-sm font-medium hover:bg-success/20"
        >
            Accept Offer
        </button>
    );
}
