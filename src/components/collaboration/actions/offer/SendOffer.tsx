'use client';

import { toast } from "sonner";

export default function SendOffer({ collaboratorId, refetchAction }: { collaboratorId: string, refetchAction: () => void }) {
    const handleSendOffer = async (id: string) => {
        try {
            const response = await fetch(`/api/collaborators/${id}/offer`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Offer sent', {
                    description: 'The offer has been sent',
                });
                refetchAction();
            } else {
                toast.error('Failed to send offer', {
                    description: data.message,
                });
            }
        } catch (err) {
            console.error('Error sending offer:', err);
            toast.error('Failed to send offer', {
                description: 'Please try again later.',
            });
        }
    };

    return (
        <button
            onClick={() => handleSendOffer(collaboratorId)}
            className="flex-1 bg-background text-foreground border border-border rounded-md py-2 px-4 text-sm font-medium hover:bg-muted"
        >
            Send Offer
        </button>
    );
}
