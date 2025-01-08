import { Button } from "@/components/ui/button";
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

export default function IntroPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            < div >

                <div className="text-left mb-12">
                    <h1 className="text-4xl font-bold mb-4">Thank you for submitting your profile!</h1>
                    <p className="text-gray-600">You will be notified within 2 business days when your profile has been approved.</p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">What happens next?</h2>
                    <Button asChild className="mb-8">
                        <Link href="/dashboard/agreement">Sign Your Agreement</Link>
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