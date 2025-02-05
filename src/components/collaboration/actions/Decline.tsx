'use client';

import { toast } from "@/hooks/use-toast";
import { useState } from "react";


export default function Decline({ collaboratorId, refetch }: { collaboratorId: string, refetch: () => void }) {
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        action: async () => { },
    });

    const handleDecline = (id: string) => {
        setDialog({
            isOpen: true,
            title: 'Decline Collaboration Request',
            message: `Are you sure you want to decline this collaboration request?`,
            action: async () => {
                try {
                    const response = await fetch(`/api/collaborators/${id}/decline`, {
                        method: 'POST',
                    });
                    const data = await response.json();
                    if (data.success) { 
                        toast({
                            title: 'Collaboration request declined',
                            description: 'The collaboration request has been declined',
                            variant: 'destructive',
                        });
                        refetch();
                    } else {
                        toast({
                            title: 'Failed to decline collaborator',
                            description: data.message,
                            variant: 'destructive',
                        });
                    }
                } catch (err) {
                    console.error('Error declining collaborator:', err);
                    toast({
                        title: 'Failed to decline collaborator',
                        description: 'Please try again later.',
                        variant: 'destructive',
                    });
                }
                setDialog(prev => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <>
            <button
                onClick={() => handleDecline(collaboratorId)}
                className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50"
            >
                Decline
            </button>
            {/* Custom Modal Dialog */}
            {dialog.isOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {dialog.title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        {dialog.message}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:col-start-2"
                                    onClick={() => dialog.action()}
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                    onClick={() => setDialog(prev => ({ ...prev, isOpen: false }))}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
