'use client'

import Header from "@/components/header";
import Image from "next/image";

export default function FindMatch() {
    return (
        <div className="bg-gray-50 min-h-screen w-full">
            <Header />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        {/* Practice Types */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">Practice Types</h3>
                                <button className="text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Medical Aesthetics</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Hormone Optimization</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>IV Infusion</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Primary Care</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Medical Weight Loss</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Mental Health</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Telemedicine</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Urgent Care</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Men&apos;s Health</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Women&apos;s Health</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Other Practice Types</span>
                                </label>
                            </div>
                            <button className="text-gray-500 mt-2">Clear</button>
                        </div>

                        {/* State Licenses */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">State Licenses</h3>
                                <button className="text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Alaska</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Alabama</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Arkansas</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Arizona</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>California</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded" />
                                    <span>Colorado</span>
                                </label>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">Price</h3>
                                <button className="text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="0"
                                        min="0"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="number"
                                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="1000"
                                        min="0"
                                    />
                                </div>
                                <input
                                    type="range"
                                    className="w-full accent-blue-600"
                                    min="0"
                                    max="1000"
                                />
                                <button className="text-gray-500 text-sm">Clear</button>
                            </div>
                        </div>
                    </div>
                    {/* Results */}
                    <div className="flex flex-1 flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <div>{42} results</div>
                            <div className="flex items-center gap-2">
                                <span>Sort by:</span>
                                <select className="border rounded-md p-2">
                                    <option>Lowest price</option>
                                    <option>Highest price</option>
                                    <option>Most recent</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Result Cards */}
                            <div className="flex gap-4 border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div className="w-40 h-40">
                                    <Image src="https://sharetribe.imgix.net/670d661b-0043-4d69-beba-e84eeb6d52fb/67859b31-da99-40b0-a748-9fa4fad3de00?auto=format&fit=clip&h=320&w=320&s=41d8f2649f08a36c4f0131a1ed8f666f" alt="Doctor" sizes="100vw"
                                        width={100}
                                        height={100}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                        }} className="rounded-md"/>
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

                            <div className="flex gap-4 border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div className="w-40 h-40">
                                    <Image src="https://sharetribe.imgix.net/670d661b-0043-4d69-beba-e84eeb6d52fb/677dcecf-5994-4c2c-94d2-194763861972?auto=format&fit=clip&h=320&w=320&s=e32ff3338b808f3473a1ffe02686228e" alt="Doctor" sizes="100vw"
                                        width={100}
                                        height={100}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                        }} className="rounded-md"/>
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
                                        }} className="rounded-md"/>
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
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}