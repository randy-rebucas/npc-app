"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Stethoscope, Syringe } from "lucide-react";

export default function OnboardingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole || !session?.user?.id) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/user/${session.user.id}/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: selectedRole }),
            });

            if (!response.ok) throw new Error('Failed to update user role');

            // Update the session with the new role
            await update();
            if (selectedRole === 'PHYSICIAN') {
                router.push('/onboarding/physician');
            } else if (selectedRole === 'NURSE_PRACTITIONER') {
                router.push('/onboarding/nurse-practitioner');
            }
        } catch (error) {
            console.error('Error updating role:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-xl w-full space-y-8 p-10">

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div
                            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${selectedRole === 'PHYSICIAN'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-200'
                                }`}
                            onClick={() => setSelectedRole('PHYSICIAN')}
                        >
                            <input
                                type="radio"
                                id="PHYSICIAN"
                                name="role"
                                value="PHYSICIAN"
                                checked={selectedRole === 'PHYSICIAN'}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="sr-only"
                            />
                            <div className="flex flex-col items-center p-4">
                                <Stethoscope className="h-12 w-12 text-blue-600 mb-3" />
                                <label
                                    htmlFor="PHYSICIAN"
                                    className="text-base font-medium text-gray-900"
                                >
                                    Physician
                                </label>
                            </div>
                        </div>

                        <div
                            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${selectedRole === 'NURSE_PRACTITIONER'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-200'
                                }`}
                            onClick={() => setSelectedRole('NURSE_PRACTITIONER')}
                        >
                            <input
                                type="radio"
                                id="NURSE_PRACTITIONER"
                                name="role"
                                value="NURSE_PRACTITIONER"
                                checked={selectedRole === 'NURSE_PRACTITIONER'}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="sr-only"
                            />
                            <div className="flex flex-col items-center p-4">
                                <Syringe className="h-12 w-12 text-blue-600 mb-3" />
                                <label
                                    htmlFor="NURSE_PRACTITIONER"
                                    className="text-base font-medium text-gray-900"
                                >
                                    Nurse Practitioner
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedRole || isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isSubmitting ? 'Saving...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
