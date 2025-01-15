'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IActiveCollaboration } from "@/app/models/Collaboration";
import { IUser } from "@/app/models/User";
import { IUserProfile } from "@/app/models/UserProfile";

export default function ActiveCollaboratorPage() {

    const { data: session } = useSession();
    const [activeCollaborations, setActiveCollaborations] = useState([]);

    useEffect(() => {
        if (session) {
            const fetchActiveCollaborations = async () => {
                const response = await fetch(`/api/active-collaboration`);
                const data = await response.json();
                setActiveCollaborations(data);
            };
            fetchActiveCollaborations();
        }
    }, [session]);

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Active Collaborations</h2>
            {activeCollaborations.length === 0 ? (
                <div className="text-center py-8">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Collaborations</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Once you accept a collaboration request and complete the onboarding process, your active collaborations will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">Name</th>
                                <th className="text-left py-3 px-4">Provider Type</th>
                                <th className="text-left py-3 px-4">State</th>
                                <th className="text-left py-3 px-4">Monthly Rate</th>
                                <th className="text-left py-3 px-4">Effective Date</th>
                                <th className="text-left py-3 px-4">Monthly Status</th>
                                <th className="text-left py-3 px-4">Collaboration Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeCollaborations.map((collab: IActiveCollaboration & { npUser: IUser & { userProfile: IUserProfile } }) => (
                                <tr key={collab._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <Link href={`/collaborations/${collab._id}`} className="text-blue-600 hover:underline">
                                            {collab.npUser.username}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4">{collab.npUser.email}</td>
                                    <td className="py-3 px-4"></td>
                                    <td className="py-3 px-4">${collab.monthlyRate}</td>
                                    <td className="py-3 px-4">{new Date(collab.startDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">
                                        {collab.status === 'paused' && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                Paused
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}