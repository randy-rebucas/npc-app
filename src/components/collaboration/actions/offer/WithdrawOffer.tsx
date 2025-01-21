'use client';

import { toast } from "@/hooks/use-toast";

export default function WithdrawOffer({ collaboratorId, refetch }: { collaboratorId: string, refetch: () => void     }) {

    const handleWithdrawOffer = async (id: string) => {
        try {
            const response = await fetch(`/api/collaborators/${id}/offer/withdraw`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to withdraw offer');
            toast({
                title: 'Offer withdrawn',
                description: 'The offer has been withdrawn',
                variant: 'default',
            });
            refetch();
        } catch (err) {
            console.error('Error withdrawing offer:', err);
            toast({
                title: 'Failed to withdraw offer',
                description: 'Please try again later.',
                variant: 'destructive',
            });
        }
    };

    return (
        <button
            onClick={() => handleWithdrawOffer(collaboratorId)}
            className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50"
        >
            Withdraw Offer
        </button>
    );
}
