'use client'

import { SimplifiedListingResponse } from "@/app/np/(physician)/listings/page";
import { useState, useEffect } from "react";

export default function Listing({ id }: { id: string }) {
    const [listing, setListing] = useState<SimplifiedListingResponse | null>(null);
    useEffect(() => {
        const fetchListing = async () => {
            const response = await fetch(`/api/listings/${id}`);
            const data = await response.json();
            console.log(data);
            setListing(data);
        }
        fetchListing();
    }, [id]);

    if (!listing) {
        return <div className="dark:text-white">Loading...</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">{listing.title}</h1>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-3 dark:text-white">Description</h2>
                <p className="text-gray-700 dark:text-gray-300">{listing.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Qualifications</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                            <h3 className="font-medium text-lg mb-2 dark:text-white">Board Certification</h3>
                            <p className="text-gray-700 dark:text-gray-300">{listing.boardCertification}</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-green-500">
                            <h3 className="font-medium text-lg mb-2 dark:text-white">Practice Types</h3>
                            <div className="flex flex-wrap gap-2">
                                {listing.practiceTypes.map((type, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-purple-500">
                            <h3 className="font-medium text-lg mb-2 dark:text-white">Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                                {listing.specialties.split(',').map((specialty, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Licensing & Certifications</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-amber-500">
                            <h3 className="font-medium text-lg mb-2 dark:text-white">State Licenses</h3>
                            <div className="flex flex-wrap gap-2">
                                {listing.stateLicenses.map((license, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-sm"
                                    >
                                        {license}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-500">
                            <h3 className="font-medium text-lg mb-2 dark:text-white">Additional Certifications</h3>
                            <div className="flex flex-wrap gap-2">
                                {listing.additionalCertifications.split(',').map((cert, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                                    >
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6 dark:text-white">Fee Structure</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-green-500">
                        <div>
                            <h3 className="font-medium text-lg dark:text-white">Monthly Base Rate</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Basic monthly subscription</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">${listing.monthlyBaseRate}</p>
                            <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                        <div>
                            <h3 className="font-medium text-lg dark:text-white">Multiple NP Fee</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Additional nurse practitioners</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${listing.multipleNPFee}</p>
                            <span className="text-sm text-gray-600 dark:text-gray-400">/provider</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-purple-500">
                        <div>
                            <h3 className="font-medium text-lg dark:text-white">Additional State Fee</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Per additional state license</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">${listing.additionalFeePerState}</p>
                            <span className="text-sm text-gray-600 dark:text-gray-400">/state</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-orange-500">
                        <div>
                            <h3 className="font-medium text-lg dark:text-white">Controlled Substance Fee</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Additional controlled substance handling</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">${listing.controlledSubstanceFee}</p>
                            <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
