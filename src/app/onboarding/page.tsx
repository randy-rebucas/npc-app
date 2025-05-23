"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Stethoscope, Syringe } from "lucide-react";

export default function OnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole || !user?.id) return;

        setIsSubmitting(true);
        router.push(`/onboarding/${selectedRole}`);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="max-w-xl w-full space-y-8 p-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div
                            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                                selectedRole === 'physician'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedRole('physician')}
                        >
                            <input
                                type="radio"
                                id="physician"
                                name="role"
                                value="physician"
                                checked={selectedRole === 'physician'}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="sr-only"
                            />
                            <div className="flex flex-col items-center p-4">
                                <Stethoscope className="h-12 w-12 text-primary mb-3" />
                                <label
                                    htmlFor="physician"
                                    className="text-base font-medium text-foreground"
                                >
                                    Physician
                                </label>
                            </div>
                        </div>

                        <div
                            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                                selectedRole === 'nurse-practitioner'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedRole('nurse-practitioner')}
                        >
                            <input
                                type="radio"
                                id="nurse-practitioner"
                                name="role"
                                value="nurse-practitioner"
                                checked={selectedRole === 'nurse-practitioner'}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="sr-only"
                            />
                            <div className="flex flex-col items-center p-4">
                                <Syringe className="h-12 w-12 text-primary mb-3" />
                                <label
                                    htmlFor="nurse-practitioner"
                                    className="text-base font-medium text-foreground"
                                >
                                    Nurse Practitioner
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedRole || isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isSubmitting ? 'Saving...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
