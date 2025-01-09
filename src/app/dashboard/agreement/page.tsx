"use client";

import Script from "next/script";
import Header from '@/components/header';

const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Agreement", href: "/dashboard/agreement", active: true },
];

export default function AgreementPage() {
    const jotformId = process.env.NEXT_PUBLIC_JOTFORM_ID;
    const jotformUrl = `https://form.jotform.com/${jotformId}`;

    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Script src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js" strategy="beforeInteractive" />
            <Header breadcrumbs={breadcrumbs} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-1 flex-col space-y-8 p-8">
                    <div id="JotFormEmbedContainer" className="w-full h-full" style={{ height: "100vh", overflow: "hidden" }}>
                        <iframe id={`JotFormIFrame-${jotformId}`} title="Contract Form" onLoad={() => window.parent.scrollTo(0, 0)} allowTransparency={true} allowFullScreen={true} allow="geolocation; microphone; camera"
                            src={jotformUrl} style={{ minWidth: "100%", maxWidth: "100%", height: "100vh", border: "none" }} scrolling="yes" > </iframe>
                    </div>
                </div>
            </main>
        </div>
    );
}

