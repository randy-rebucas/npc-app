import { getUserByEmail } from "@/app/actions/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

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

export default async function IntroPage() {
    const session = await getServerSession(authOptions);

    const user = await getUserByEmail(session?.user.email);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <h3 className="font-medium">Information</h3>
                        </div>
                    </div>
                    <div className="mt-2 text-sm">
                        Your profile is currently in review. You will be notified within 2 business days when your profile has been approved.
                    </div>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900 mb-8">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <h3 className="font-medium">Current Status</h3>
                        </div>
                        <p className="text-blue-700 font-medium">
                            {user.submissionStatus}
                        </p>
                    </div>
                    <div className="mt-2 text-sm">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </div>

                {/* Timeline information and guides */}
                <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-2xl font-bold mb-6">What happens next?</h2>
                    <Button asChild className="mb-8 w-full sm:w-auto">
                        <Link href="/np/agreement">Sign Your Agreement</Link>
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
        </div >
    );
}