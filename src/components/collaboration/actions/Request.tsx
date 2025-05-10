'use client'

import { toast } from "sonner";

export default function Request({ id }: { id: string }) {
    
    const handleRequest = async (id: string) => { 
        const response = await fetch(`/api/collaborators/${id}/request`, {
            method: 'POST',
        });
        const data = await response.json();
        if (data.success) {
            toast.success('Collaboration requested', {
                description: 'The collaborator has been requested',
            });
        } else {
            toast.error('Failed to request collaboration', {
                description: data.message,
            });
        }
    };

    return (
        <button 
            onClick={() => handleRequest(id)}
            className="w-full bg-success hover:bg-success/90 text-success-foreground py-3 px-4 rounded-lg transition-colors"
        >
            Request Collaboration
        </button>
    )
}