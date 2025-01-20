'use client';
import Header from "@/components/header";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import Image from "next/image";

type Collaborator = {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'pending';
    avatarUrl?: string;
};

type ConfirmationDialog = {
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    collaborator?: Collaborator;
};

export default function CollaboratorsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');

    const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [dialog, setDialog] = useState<ConfirmationDialog>({
        isOpen: false,
        title: '',
        message: '',
        action: () => { },
    });

    useEffect(() => {
        const fetchCollaborators = async () => {
            setIsLoading(true);
            try {
                // Replace with your actual API endpoint
                const response = await fetch(`/api/collaborators/${activeTab === 'active' ? 'active' : 'request'}?status=${activeTab}`);
                if (!response.ok) throw new Error('Failed to fetch collaborators');
                const data = await response.json();
                console.log(data);
                setCollaborators(data);
            } catch (err) {
                console.error('Error fetching user:', err);
                toast({
                    title: 'Failed to load collaborators',
                    description: 'Please try again later.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollaborators();

    }, [activeTab, toast]);


    const handleAccept = async (id: string) => {
        const response = await fetch(`/api/collaborators/${id}/accept`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to accept collaborator');
        setCollaborators(collaborators.map(collab =>
            collab.id === id ? { ...collab, status: 'active' } : collab
        ));
        toast({
            title: 'Collaborator accepted',
            description: 'The collaborator has been accepted',
            variant: 'default',
        });
    };

    const handleSendOffer = async (id: string) => {
        const response = await fetch(`/api/collaborators/${id}/offer`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to send offer');
        toast({
            title: 'Offer sent',
            description: 'The offer has been sent',
            variant: 'default',
        });
    };

    const handleDecline = (id: string) => {
        setDialog({
            isOpen: true,
            title: 'Decline Collaboration Request',
            message: `Are you sure you want to decline this collaboration request?`,
            action: async () => {
                try {
                    // Replace with your actual API endpoint
                    const response = await fetch(`/api/collaborators/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error('Failed to decline collaborator');

                    setCollaborators(collaborators.filter(collab => collab.id !== id));
                    toast({
                        title: 'Collaboration request declined',
                        description: 'The collaboration request has been declined',
                        variant: 'destructive',
                    });
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

    const handleRemove = (id: string) => {
        setDialog({
            isOpen: true,
            title: 'Remove Collaborator',
            message: `Are you sure you want to remove this collaborator?`,
            action: async () => {
                try {
                    // Replace with your actual API endpoint
                    const response = await fetch(`/api/collaborators/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error('Failed to remove collaborator');

                    setCollaborators(collaborators.filter(collab => collab.id !== id));
                    toast({
                        title: 'Collaborator removed',
                        description: 'The collaborator has been removed',
                        variant: 'destructive',
                    });
                } catch (err) {
                    console.error('Error removing collaborator:', err);
                    toast({
                        title: 'Failed to remove collaborator',
                        description: 'Please try again later.',
                        variant: 'destructive',
                    });
                }
                setDialog(prev => ({ ...prev, isOpen: false }));
            },
        });

    };

    const handleAddCollaborator = async () => {
        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/collaborators/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newCollaboratorEmail }),
            });
            if (!response.ok) throw new Error('Failed to send invitation');

            toast({
                title: 'Invitation sent',
                description: `Invitation sent to ${newCollaboratorEmail}`,
                variant: 'default',
            });
            setShowAddDialog(false);
            setNewCollaboratorEmail('');
        } catch (err) {
            console.error('Error sending invitation:', err);
            toast({
                title: 'Failed to send invitation',
                description: 'Please try again later.',
                variant: 'destructive',
            });
        }
    };

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
        } catch (err) {
            console.error('Error withdrawing offer:', err);
            toast({
                title: 'Failed to withdraw offer',
                description: 'Please try again later.',
                variant: 'destructive',
            });
        }
    };

    const handleCancelOffer = async (id: string) => {
        try {
            const response = await fetch(`/api/collaborators/${id}/offer/cancel`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to cancel offer');
            toast({
                title: 'Offer cancelled',
                description: 'The offer has been cancelled',
                variant: 'destructive',
            });
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
        <div className="bg-gray-50 min-h-screen w-full">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8">
                    <div className="space-y-6">
                        <div className="mb-4 flex justify-between items-center">
                            <h1 className="text-2xl font-bold">Collaborators</h1>
                            <button
                                onClick={() => setShowAddDialog(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Add Collaborator
                            </button>
                        </div>

                        {/* Filter Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium ${activeTab === 'active'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Active Collaborators
                                </button>
                                <button
                                    onClick={() => setActiveTab('pending')}
                                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium ${activeTab === 'pending'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Pending Requests
                                </button>
                            </nav>
                        </div>

                        {/* Collaborators Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {isLoading ? (
                                // Loading skeleton UI
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-full bg-gray-200" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                            </div>
                                            <div className="mt-4 flex space-x-3">
                                                <div className="flex-1 h-8 bg-gray-200 rounded" />
                                                <div className="flex-1 h-8 bg-gray-200 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : collaborators.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
                                    <div className="text-center">
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                                            {activeTab === 'active'
                                                ? 'No active collaborators'
                                                : 'No pending requests'}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {activeTab === 'active'
                                                ? "You haven't added any collaborators yet."
                                                : "You don't have any pending collaboration requests."}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                collaborators.map((collaborator) => (
                                    <div key={collaborator.id} className="bg-white shadow rounded-lg p-6">
                                        <div className="flex items-center space-x-4">
                                            {collaborator.avatarUrl ? (
                                                <Image
                                                    src={collaborator.avatarUrl}
                                                    alt={`${collaborator.name}'s avatar`}
                                                    width={48}
                                                    height={48}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-500 text-lg font-medium">
                                                        {collaborator.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium">{collaborator.name}</h3>
                                                <p className="text-sm text-gray-500">{collaborator.email}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${collaborator.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {collaborator.status}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex space-x-3">
                                            {collaborator.status === 'active' ? (
                                                <>
                                                    <button className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50">
                                                        Message
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(collaborator.id)}
                                                        className="flex-1 bg-red-50 text-red-600 border border-red-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-red-100"
                                                    >
                                                        Remove
                                                    </button>
                                                </>
                                            ) : collaborator.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAccept(collaborator.id)}
                                                        className="flex-1 bg-indigo-600 text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-indigo-700"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecline(collaborator.id)}
                                                        className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50"
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            ) : collaborator.status === 'offered' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleWithdrawOffer(collaborator.id)}
                                                        className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50"
                                                    >
                                                        Withdraw Offer
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelOffer(collaborator.id)}
                                                        className="flex-1 bg-red-50 text-red-600 border border-red-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-red-100"
                                                    >
                                                        Cancel Offer
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleSendOffer(collaborator.id)}
                                                        className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50"
                                                    >
                                                        Send Offer
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(collaborator.id)}
                                                        className="flex-1 bg-red-50 text-red-600 border border-red-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-red-100"
                                                    >
                                                        Remove
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

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

            {/* Add Collaborator Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Add New Collaborator
                                </h3>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        value={newCollaboratorEmail}
                                        onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:col-start-2"
                                    onClick={handleAddCollaborator}
                                >
                                    Send Invitation
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                    onClick={() => setShowAddDialog(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}