'use client';

import { toast } from "@/hooks/use-toast";

export default function SendOffer({ collaboratorId, refetch }: { collaboratorId: string, refetch: () => void }) {
    const handleSendOffer = async (id: string) => {
        try {
            const response = await fetch(`/api/collaborators/${id}/offer`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.success) {
                toast({
                    title: 'Offer sent',
                    description: 'The offer has been sent',
                    variant: 'default',
                });
                refetch();
            } else {
                toast({
                    title: 'Failed to send offer',
                    description: data.message,
                    variant: 'destructive',
                });
            }
        } catch (err) {
            console.error('Error sending offer:', err);
            toast({
                title: 'Failed to send offer',
                description: 'Please try again later.',
                variant: 'destructive',
            });
        }
    };

    return (
        <button
            onClick={() => handleSendOffer(collaboratorId)}
            className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50"
        >
            Send Offer
        </button>
    );
}
