'use client'

import { ICollaborationRequest } from "@/app/models/Collaboration";
import { IUserProfile } from "@/app/models/UserProfile";
import { IUser } from "@/app/models/User";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";


export default function CollaboratorRequestsPage() {
    const { user } = useAuth();
    const [collaborationRequests, setCollaborationRequests] = useState([]);

    useEffect(() => {
        if (user?.id) {
            const fetchCollaborationRequests = async () => {
                const response = await fetch(`/api/collaboration-request`);
                const data = await response.json();
                setCollaborationRequests(data);
            };
            fetchCollaborationRequests();
        }
    }, [user?.id]);

    return (
        <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-foreground">New Collaboration Requests</h2>
            <div className="space-y-4">
                {collaborationRequests.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-1">No Pending Requests</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            You&apos;ll be notified when nurse practitioners request to collaborate with you.
                        </p>
                    </div>
                ) : (
                    collaborationRequests.map((request: ICollaborationRequest & { npUser: IUser & { userProfile: IUserProfile } }) => (
                        <div key={request._id} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-muted rounded-full" />
                                    <div>
                                        <h3 className="font-semibold text-foreground">{request.npUser.username}</h3>
                                        <p className="text-sm text-muted-foreground">{request.npUser.customData?.onboardingStatus}</p>
                                    </div>
                                </div>
                                <Link   
                                    href={`/np/detail/${request._id}`}
                                    className="text-primary hover:text-primary/80"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}