"use client";

import Script from "next/script";
import Header from '@/components/header';
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserById } from "@/app/actions/user";

export default function AgreementPage() {
    const jotformId = process.env.NEXT_PUBLIC_JOTFORM_ID;
    const [jotformUrl, setJotformUrl] = useState(`https://form.jotform.com/${jotformId}`);
    const [formFilled, setFormFilled] = useState(false);
    const { data: session } = useSession();

    // Improve iframe handling
    useEffect(() => {
        const handleIframeResize = () => {
            const iframe = document.getElementById(`JotFormIFrame-${jotformId}`);
            if (iframe) {
                iframe.style.height = '100vh';
                iframe.style.minHeight = '100vh';
                iframe.style.maxHeight = '100vh';
            }
        };

        window.addEventListener('load', handleIframeResize);
        
        return () => {
            window.removeEventListener('load', handleIframeResize);
        };
    }, [jotformId]);

    const fillJotformFields = useCallback((data: Record<string, string | number | string[]>) => {
        if (formFilled) return;

        const prefilledUrl = new URL(`https://form.jotform.com/${jotformId}`);
        Object.entries(data).forEach(([key, value]) => {
            if (value) {
                prefilledUrl.searchParams.append(key, String(value));
            }
        });

        setJotformUrl(prefilledUrl.toString());
        setFormFilled(true);
    }, [jotformId, formFilled]);

    const checkMemberstackAlternative = useCallback(async () => {
        if (!session) {
            console.warn('User is not logged in');
            return;
        }

        try {
            const user = await getUserById(session.user.id);
            console.log(user);
            if (!user) {
                console.warn('User is not logged in or data is missing.');
                return;
            }
            console.log(user.profile); 
            const userData = {
                'first-name': user.profile.firstName || '',
                'last-name': user.profile.lastName || '',
                'email': user.email || '',
                'member_id': user._id || '',
                'npi': user.profile.npiNumber || '', 
                'base-rate': user.profile.monthlyCollaborationRate || '',
                'state-fee': user.profile.additionalStateFee || '',
                'background': user.profile.description || '',
                'control-fee': user.profile.controlledSubstancesMonthlyFee || '',
                'degree-type': user.profile.clinicalDegree || '',
                'linkedin-url': user.profile.linkedinProfile || '',
                'multi-np-fee': user.profile.additionalNPFee || '',
                'practice-types': user.profile.practiceTypes || '',
                'id-document-url': user.profile.governmentIdPath || '',
                'board-certification': user.profile.boardCertification || '',
                'active-license-states': user.profile.medicalLicenseStates?.map(l => l.state) || [],
                'additional-certification': user.profile.additionalCertifications?.map(c => c.certification) || [],
                'address': user.profile.address || '',
                'city': user.profile.city || '',
                'state': user.profile.state || '',
                'zip': user.profile.zip || '',
            };
            
            fillJotformFields(userData);
        } catch (error) {
            console.error('Error getting current member:', error);
        }
    }, [fillJotformFields, session]);

    // Initial check
    useEffect(() => {
        const handleLoad = () => {
            if (!formFilled) {
                checkMemberstackAlternative();
            }
        };

        checkMemberstackAlternative();
        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, [checkMemberstackAlternative, formFilled]);

    // Periodic check
    useEffect(() => {
        if (formFilled) return;

        const maxAttempts = 10;
        let attempts = 0;

        const checkInterval = setInterval(() => {
            attempts++;
            if (!formFilled) {
                checkMemberstackAlternative();
            }
            if (attempts >= maxAttempts || formFilled) {
                clearInterval(checkInterval);
            }
        }, 1000);

        return () => {
            clearInterval(checkInterval);
        };
    }, [formFilled, checkMemberstackAlternative]);

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Script 
                src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js" 
                strategy="beforeInteractive"
            />
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8 p-8">
                    <div 
                        id="JotFormEmbedContainer" 
                        className="w-full h-full" 
                        style={{ height: "100vh", overflow: "hidden" }}
                    >
                        <iframe
                            id={`JotFormIFrame-${jotformId}`}
                            title="Contract Form"
                            onLoad={() => window.parent.scrollTo(0, 0)}
                            allowTransparency={true}
                            allowFullScreen={true}
                            allow="geolocation; microphone; camera"
                            src={jotformUrl}
                            style={{
                                minWidth: "100%",
                                maxWidth: "100%",
                                height: "100vh",
                                border: "none"
                            }}
                            scrolling="yes"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

