import Image from "next/image";
import { SimplifiedUserResponse } from "@/app/np/find-match/page";

export default function Results({ results }: { results: SimplifiedUserResponse[] }) {
    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Result Cards */}
            {results.map((result) => (
                <div key={result.id} className="flex gap-4 border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="w-40 h-40">
                        <Image src="https://sharetribe.imgix.net/670d661b-0043-4d69-beba-e84eeb6d52fb/67859b31-da99-40b0-a748-9fa4fad3de00?auto=format&fit=clip&h=320&w=320&s=41d8f2649f08a36c4f0131a1ed8f666f" alt="Doctor" sizes="100vw"
                            width={100}
                            height={100}
                            style={{
                                width: '100%',
                                height: 'auto',
                            }} className="rounded-md" />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-semibold">Dr. Sarah Johnson, MD</h2>
                            <button className="p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-lg font-medium mb-2">Total Price: $450.00</div>
                        <div className="text-gray-600 mb-1">Medical Aesthetics, IV Therapy</div>
                        <div className="text-gray-600 line-clamp-2">
                            15+ years of experience in aesthetic medicine. Specializing in advanced injectable treatments and personalized IV therapy protocols.
                        </div>
                    </div>
                </div>
            ))}

            {/* <div className="flex gap-4 border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="w-40 h-40">
                    <Image src="https://sharetribe.imgix.net/670d661b-0043-4d69-beba-e84eeb6d52fb/677dcecf-5994-4c2c-94d2-194763861972?auto=format&fit=clip&h=320&w=320&s=e32ff3338b808f3473a1ffe02686228e" alt="Doctor" sizes="100vw"
                        width={100}
                        height={100}
                        style={{
                            width: '100%',
                            height: 'auto',
                        }} className="rounded-md" />
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold">Dr. Michael Chen, DO</h2>
                        <button className="p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-lg font-medium mb-2">Total Price: $375.00</div>
                    <div className="text-gray-600 mb-1">Primary Care, Telemedicine</div>
                    <div className="text-gray-600 line-clamp-2">
                        Board-certified in family medicine with a focus on preventive care and chronic disease management. Available for virtual consultations.
                    </div>
                </div>
            </div>

            <div className="flex gap-4 border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="w-40 h-40">
                    <Image src="https://sharetribe.imgix.net/670d661b-0043-4d69-beba-e84eeb6d52fb/670ee430-f8e8-471d-9c0e-b7d199d38c3a?auto=format&fit=clip&h=320&w=320&s=f31522ff7bb45e776c41d4245bc35bf3" alt="Doctor" sizes="100vw"
                        width={100}
                        height={100}
                        style={{
                            width: '100%',
                            height: 'auto',
                        }} className="rounded-md" />
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold">Dr. Emily Rodriguez, NP</h2>
                        <button className="p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-lg font-medium mb-2">Total Price: $425.00</div>
                    <div className="text-gray-600 mb-1">Hormone Optimization, Women&apos;s Health</div>
                    <div className="text-gray-600 line-clamp-2">
                        Specialized in hormone replacement therapy and women&apos;s health. Offering personalized treatment plans for optimal wellness.
                    </div>
                </div>
            </div> */}
        </div>
    );
}
