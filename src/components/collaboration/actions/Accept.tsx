'use client';

import { toast } from "@/hooks/use-toast";

export default function Accept({ collaboratorId, refetch }: { collaboratorId: string, refetch: () => void }) {
    const handleAccept = async (id: string) => {
        const response = await fetch(`/api/collaborators/${id}/accept`, {
            method: 'POST',
        });
        const data = await response.json();
        if (data.success) {
            toast({
                title: 'Collaborator accepted',
                description: 'The collaborator has been accepted',
                variant: 'default',
            });
            refetch();
        } else {
            toast({
                title: 'Failed to accept collaborator',
                description: data.message,
                variant: 'destructive',
            });
        }
    };

    return (
        <button
            onClick={() => handleAccept(collaboratorId)}
            className="flex-1 bg-indigo-600 text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-indigo-700"
        >
            Accept
        </button>
    );
}
