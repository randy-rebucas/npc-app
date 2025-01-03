import Header from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ActiveCollaboration, CollaborationRequest } from "../models/Collaboration";
import { getUserByEmail } from "../actions/user";

export const metadata: Metadata = {
    title: 'Dashboard',
};

interface TimelineItem {
    title: string;
    description: string;
    status?: 'completed' | 'current' | 'upcoming';
}

const timeline: TimelineItem[] = [
    {
        title: "Your Profile Is Live",
        description: "Once your profile and credentials are validated, calendar synced, and agreement is signed, your profile will be live for our algorithms to make available for matching to NP's and PA's."
    },
    {
        title: "NP Match",
        description: "When an NP joins our service, they create a profile of their practice and collaborating needs. Our matching algorithms will provide a minimum of 3 physicians that match their criteria."
    },
    {
        title: "NP Compares Matches",
        description: "The NP will review the physician profiles to learn more about them and compare monthly rates."
    },
    {
        title: "Video Intro",
        description: "The NP will select 1-2 physicians for a video call to assess compatibility. After the call, both parties can decide whether to proceed with the collaboration."
    },
    {
        title: "Finalize Credentials",
        description: "Upon mutual approval, you'll be asked to submit remaining credentials. If your profile was already complete and validated beforehand, expect a faster path to finalizing the collaborative agreement."
    },
    {
        title: "Collaboration Agreement",
        description: "You and the NP will each sign the Collaboration Agreement. This agreement outlines the terms of the collaboration, including payment structure, collaboration scope, and expectations."
    },
    {
        title: "Collaboration Begins!",
        description: "You'll be launched into our collaboration portal with built in monthly attestation, and payment hub."
    },
    {
        title: "Ongoing Support",
        description: "Our commitment doesn&apos;t end with the match. We provide ongoing collaboration supports, addressing any issues or questions that arise."
    },
]

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const user = await getUserByEmail(session.user.email);

    // Add this section to fetch collaborations
    const collaborationRequests = await CollaborationRequest.find({
        physicianUser: user._id,
        status: 'pending'
    }).populate('npUser');

    const activeCollaborations = await ActiveCollaboration.find({
        physicianUser: session.user.id,
        status: 'active'
    }).populate('npUser');

    return (
        <SidebarInset className="bg-gray-50 min-h-screen w-full">
            <Header breadcrumbs={[
                { label: 'Dashboard', href: '/dashboard' }
            ]} />

            {!user.validated && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="max-w-7xl mx-auto p-6">
                        < div >

                            <div className="text-left mb-12">
                                <h1 className="text-4xl font-bold mb-4">Thank you for submitting your profile!</h1>
                                <p className="text-gray-600">You will be notified within 2 business days when your profile has been approved.</p>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-6">What happens next?</h2>
                                <Button asChild className="mb-8">
                                    <Link href="/">Sign Your Agreement</Link>
                                </Button>
                                <p className="text-gray-600">
                                    After approval, you will receive an email that links you to the agreement you&apos;ll need to sign before
                                    your profile is active on NP Collaborator. The email will also give you instructions on how to
                                    connect your calendar.
                                </p>
                            </div>




                        </div>

                        <div className="space-y-6 relative">
                            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-emerald-100" role="presentation" />

                            {timeline.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start group"
                                    role="listitem"
                                    aria-label={`Timeline step ${index + 1}: ${item.title}`}
                                >
                                    <div className="relative">
                                        <div
                                            className="absolute left-3 top-[0.875rem] w-3 h-3 bg-white border-[3px] border-emerald-500 rounded-full z-10 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-600"
                                            role="presentation"
                                        />
                                    </div>
                                    <div className="flex-1 ml-12">
                                        <div className="bg-white/50 rounded-xl hover:bg-white/80 transition-all duration-300 p-4">
                                            <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div >
            )}
            {user.validated && (
                <main className="py-6 px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-1 flex-col space-y-8 p-8">
                        <div className="flex items-center justify-between space-y-2">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                                <p className="text-muted-foreground">
                                    Welcome to your dashboard!
                                </p>
                            </div>
                        </div>
                        {/* Add Collaboration Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg border bg-white flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Active Collaborations</p>
                                    <p className="text-3xl font-bold">{activeCollaborations.length}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                                    </svg>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border bg-white flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Hours This Month</p>
                                    <p className="text-3xl font-bold">6</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border bg-white flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Requests</p>
                                    <p className="text-3xl font-bold">{collaborationRequests.length}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border bg-white flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Available Hours</p>
                                    <p className="text-3xl font-bold">10</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Add Collaboration Requests Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">New Collaboration Requests</h2>
                            <div className="space-y-4">
                                {collaborationRequests.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Requests</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto">
                                            You&apos;ll be notified when nurse practitioners request to collaborate with you.
                                        </p>
                                    </div>
                                ) : (
                                    collaborationRequests.map((request) => (
                                        <div key={request._id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                                    <div>
                                                        <h3 className="font-semibold">{request.npUser.name}</h3>
                                                        <p className="text-sm text-gray-600">{request.npUser.experience || 'New Graduate'}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    className="text-primary hover:text-primary/80"
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {request.npUser.tags?.map((tag: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Active Collaborations Section */}
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
                                            {activeCollaborations.map((collab) => (
                                                <tr key={collab._id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <Link href={`/collaborations/${collab._id}`} className="text-blue-600 hover:underline">
                                                            {collab.npUser.name}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3 px-4">{collab.npUser.providerType}</td>
                                                    <td className="py-3 px-4">{collab.npUser.state}</td>
                                                    <td className="py-3 px-4">${collab.monthlyRate}</td>
                                                    <td className="py-3 px-4">{new Date(collab.startDate).toLocaleDateString()}</td>
                                                    <td className="py-3 px-4">
                                                        {collab.monthlyStatus === 'ACTION_REQUIRED' && (
                                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                                ACTION REQUIRED
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

                    </div>
                </main>
            )}

        </SidebarInset >
    );
}